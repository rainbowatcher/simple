<script lang="ts" setup>
import type { FormValidationError } from "naive-ui/es/form/src/interface"
import type { SelectBaseOption } from "naive-ui/es/select/src/interface"
import type {
  DataSourceType,
  DataSourceVO,
} from "src/server/domain"
import {
  dataSourceTypes,
dataSourceVoValidator,
} from "src/server/domain"

const props = defineProps<{
  model?: DataSourceVO
}>()

const emit = defineEmits<{
  (e: "closeModel"): void
  (e: "submitModel", value: any): void
}>()

const defaultPorts: Partial<Record<DataSourceType, number>> = {
  mysql: 3306,
  oracle: 1521,
  hive: 10000,
  clickhouse: 8123,
}

const message = useMessage()
const formRef = ref()
const defaultData: DataSourceVO = {
  name: "",
  type: "mysql",
  host: "",
  port: "",
  user: "",
  password: "",
  database: "",
}
const data = ref<DataSourceVO>({ ...(props.model ?? defaultData) })
const dbTypeOptions = dataSourceTypes.map<SelectBaseOption>(t => ({
  label: t,
  value: t,
}))

const rules = useDataSourceFormRules()

const submit = () => {
  if (formRef) {
    formRef.value?.validate((errors: FormValidationError[]) => {
      if (!errors) {
        emit("submitModel", data)
        emit("closeModel")
      } else {
        message.error("Validate failed")
      }
    })
  }
}

const reset = () => {
  data.value = { ...defaultData }
}

const onSelect = (type: DataSourceType) => {
  const port = defaultPorts[type]
  if (port) {
    data.value.port = `${port}`
  }
  data.value.type = type
}

function isSubmitDisable() {
  return dataSourceVoValidator.safeParse(data.value).success
}
</script>

<template>
  <NForm
    ref="formRef"
    v-model:model="data"
    label-placement="left"
    label-width="6rem"
    max-w-xl
    ma
    :rules="rules"
  >
    <NFormItem label="Name" path="name">
      <NInput
        v-model:value="data.name"
        placeholder="Name"
        :allow-input="useNotAllowWhiteSpace"
      />
    </NFormItem>

    <NFormItem label="Host" path="host">
      <NInput v-model:value="data.host" placeholder="Host" />
    </NFormItem>

    <NGrid :cols="24" :x-gap="12">
      <NFormItemGi :span="12" label="Type" path="type">
        <NSelect
          v-model:value="data.type"
          filterable
          :options="dbTypeOptions"
          :on-update:value="onSelect"
          placeholder="Database Type"
        />
      </NFormItemGi>

      <NFormItemGi :span="12" path="port" label="Port">
        <NInput
          v-model:value="data.port"
          placeholder="Port"
          :allow-input="useAllowInteger"
        />
      </NFormItemGi>
    </NGrid>

    <NGrid :cols="24" :x-gap="12">
      <NFormItemGi :span="12" label="User" path="user">
        <NInput v-model:value="data.user" placeholder="User" />
      </NFormItemGi>

      <NFormItemGi :span="12" label="Database" path="database">
        <NInput v-model:value="data.database" placeholder="Database" />
      </NFormItemGi>
    </NGrid>

    <NFormItem label="Password" path="password">
      <NInput v-model:value="data.password" placeholder="Password" />
    </NFormItem>

    <NSpace justify="end">
      <NButton @click="$emit('closeModel')">
        Cancel
      </NButton>
      <NButton attr-type="reset" @click="reset()">
        Restore
      </NButton>
      <NButton :disabled="isSubmitDisable()" type="primary" @click="submit()">
        Submit
      </NButton>
    </NSpace>
  </NForm>
</template>
