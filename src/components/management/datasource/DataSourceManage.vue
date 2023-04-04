<script lang="ts" setup>
import { NButton, NButtonGroup } from "naive-ui"
import type {
  RowData,
  TableColumn,
  TableColumns,
} from "naive-ui/es/data-table/src/interface"
import type { DataSourceVO } from "src/server/domain"
import { capitalize } from "vue"
import DataSourceForm from "./DataSourceForm.vue"

const {
  data: dataSources,
  isFinished,
  isLoading,
  execute: refresh,
} = reqDataSources()
const dialoger = useDialog()
const messager = useMessage()
const voList = ref<DataSourceVO[]>()
watch(isFinished, () => {
  if (isFinished.value) {
    voList.value = dataSources.value?.data
    columns.value = Object.keys(dataSources.value?.data?.[0] ?? []).map<TableColumn>(
      i =>
        ({
          key: i,
          // filter: i === "type" ? "default" : false,
          // filterMode: "and",
          // filterOptions:
          //   i === "type"
          //     ? dataSourceTypes.map((i) => ({ value: i, label: i }))
          //     : undefined,
          sorter: "default",
          title: capitalize(i),
        }),
    )
    columns.value.push({
      title: "Actions",
      key: "delete",
      width: "6rem",
      fixed: "right",
      render: (row: RowData) =>
        h(NButtonGroup, () => [
          h(
            NButton,
            {
              tertiary: true,
              size: "small",
              onClick: () => editDataSource(row),
            },
            () => h("div", { class: "i-mdi-file-edit text-16px" }),
          ),
          h(
            NButton,
            {
              tertiary: true,
              size: "small",
              type: "error",
              onClick: () => deleteDataSource(row),
            },
            () => h("div", { class: "i-mdi-delete text-18px" }),
          ),
        ]),
    })
    search()
  }
})
const columns = ref<TableColumns>([])
const dataSourceView = ref<DataSourceVO>()
const pagination = ref({
  page: 1,
  pageSize: 10,
  showSizePicker: true,
  pageSizes: [10, 30, 50],
  onChange: (page: number) => {
    pagination.value.page = page
  },
  onUpdatePageSize: (pageSize: number) => {
    pagination.value.pageSize = pageSize
    pagination.value.page = 1
  },
})
// provide<Ref<CommonDataSourceView>>("dataSourceView", dataSourceView)
const [showAddModal, toggleAddModal] = useToggle(false)
const [showEditModal, toggleEditModal] = useToggle(false)
const { result, keyword, search } = useSearch<RowData>(voList, {
  fuzzy: true,
})

const addDataSource = async (rowData: Ref<DataSourceVO>) => {
  const { data } = await reqAddDataSource(rowData.value)
  const { message, status } = data.value!
  messager.create(message ?? "", { type: useType(status) })
  await refresh()
}

const deleteDataSource = (rowData: RowData) => {
  dialoger.warning({
    content: "Please comfirm you want to delete this record!",
    positiveText: "Confirm",
    negativeText: "Cancel",
    bordered: true,
    onPositiveClick: async () => {
      const { data } = await reqDelDataSource(rowData.type, rowData.name)
      const { message, status } = data.value!
      messager.create(message ?? "", { type: useType(status) })
      await refresh()
    },
  })
}

const editDataSource = async (rowData: RowData) => {
  dataSourceView.value = rowData as DataSourceVO
  toggleEditModal()
}

async function updateDataSource(rowData: Ref<DataSourceVO>) {
  const { data } = await reqUpdate(rowData.value)
  const { status, message } = data.value!
  messager.create(message ?? "", { type: useType(status) })
  await refresh()
}
</script>

<template>
  <NSpace justify="end" mb-2>
    <NInput
      v-model:value="keyword"
      placeholder="Fuzzy Search"
      @keydown="search"
    >
      <template #suffix>
        <NButton text @click="search">
          <div class="i-mdi-magnify" />
        </NButton>
      </template>
    </NInput>
    <NButton ghost @click="toggleAddModal()">
      <div class="i-mdi-plus" />
    </NButton>
  </NSpace>

  <NDataTable
    :columns="columns"
    :loading="isLoading"
    :data="result"
    :scroll-x="1080"
    :pagination="pagination"
  />

  <NModal v-model:show="showAddModal" transform-origin="center">
    <NCard title="Add dataSource" w-2xl aria-modal="true">
      <DataSourceForm
        @close-model="toggleAddModal(false)"
        @submit-model="addDataSource"
      />
    </NCard>
  </NModal>

  <NModal v-model:show="showEditModal" transform-origin="center">
    <NCard title="Add dataSource" w-2xl aria-modal="true">
      <DataSourceForm
        :model="dataSourceView"
        @close-model="toggleEditModal(false)"
        @submit-model="updateDataSource"
      />
    </NCard>
  </NModal>
</template>
