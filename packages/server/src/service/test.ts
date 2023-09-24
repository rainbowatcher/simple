type FileTree = {
  name: string
  children?: FileTree[]
}

function buildFileTree(fileList: string[]): FileTree[] {
  const fileTree: FileTree[] = []

  fileList.forEach((filePath: string) => {
    const pathArray = filePath.split("/")
    let currentLevel = fileTree

    pathArray.forEach((name, index) => {
      const existingNode = currentLevel.find(node => node.name === name)

      const newNode: FileTree = {
        name,
        children: [],
      }

      if (existingNode) {
        currentLevel = existingNode.children || []
      }
      else {

        currentLevel.push(newNode)
        currentLevel = newNode.children!
      }

      if (index === pathArray.length - 1 && !newNode.children) {
        newNode.children = undefined
      }
    })
  })

  return fileTree
}
const fileList = [
  "bb.hbs",
  "hello.hbs",
  "trash/",
  "trash/SQL到hive.hbs",
  "trash/aaa.hbs",
  "trash/abc.hbs",
  "trash/foo/",
  "trash/paixu.hbs",
  "trash/foo/bar",
]

const fileTree = buildFileTree(fileList)
console.log(fileTree)
