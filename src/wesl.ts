import { uniformsWgsl, shaderCode, Vertex } from "./shader";

// Wgsl string for a single struct
console.log(Vertex.wgsl);

// Wgsl string with uniform declarations and deduplicated structs
console.log(uniformsWgsl);

// Wgsl string for the whole shader code
console.log(shaderCode);


export const getFinalWgsl = () => {
    // TODO
    // How can i leverage wesl to have imports/exports in my shader code and export the final wgsl string from here?
    // Any other ideas on how to use wesl in a setup like this?
    return shaderCode;
}