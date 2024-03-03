import * as ts from "typescript"

const visit = (node: ts.Node) => {
  let output = {}
  // Making sure the node is a type alias declaration
  if (ts.isTypeAliasDeclaration(node)) {
    let children = {}
    
    // Iterating through every variable of the type
    node.type.members.map((member) => { 
      // Initialising an array just in case theres a UnionType
      let variant: string[] = []
      if (member.type.types) {
        member.type.types.map((literal) => {
          variant.push(literal.literal.text)
        })
        children[member.name.text] = variant
      }
      // If it's not a UnionType, the TypeLiteral only has the one literal
      else if (member.type.literal) {
        children[member.name.text] = member.type.literal.text
      }

    })
    output[node.name.text] = children
    console.log(output)
  }
}

const convertToObject = (type: string) => {

  let sourcefile = ts.createSourceFile("test.ts", type, ts.ScriptTarget.Latest)

  ts.forEachChild(sourcefile, visit)
}
convertToObject(`type Button = {
  variant: "solid" | "text";
}`)