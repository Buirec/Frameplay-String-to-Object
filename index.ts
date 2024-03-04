import * as ts from "typescript"

interface TypeWithMembers extends ts.TypeNode {
  members : Array<any>
}

const visit = (node: ts.Node) => {
  let output = {}
  // Making sure the node is a type alias declaration
  if (ts.isTypeAliasDeclaration(node)) {
    let children = {}
    let type = node.type as TypeWithMembers
    
    // Iterating through every variable of the type
    type.members.map((member) => { 
      // Initialising an array just in case theres a UnionType
      let variant: string[] = []
      let name: string = member.name.text
      if (member.questionToken) {
        name += "?"
      }
      if (member.type.types) {
        member.type.types.map((literal) => {
          variant.push(literal.literal.text)
        })
        children[name] = variant
      }
      // If it's not a UnionType, the TypeLiteral only has the one literal
      else if (member.type.literal) {
        children[name] = member.type.literal.text
      }
      // Checks for if the type is a type keyword instead of a literal
      else if (member.type.kind == ts.SyntaxKind.StringKeyword) {
        children[name] = "string"
      }
      else if (member.type.kind == ts.SyntaxKind.NumberKeyword) {
        children[name] = "number"
      }
      else if (member.type.kind == ts.SyntaxKind.BooleanKeyword) {
        children[name] = "boolean"
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

convertToObject(`type Payload = {
  id: string;
  name?: string;
  phone: number;
}`)

convertToObject(`type Phonebook = {
  name: string;
  number: number;
  active: boolean;
}`)
