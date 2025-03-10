import { Structs } from "@timefold/engine";
import { Uniform, WebgpuUtils } from "@timefold/webgpu";

export const SceneUniformGroup = Uniform.group(0, {
    scene: Uniform.buffer(0, Structs.Scene),
});

export const EntityUniformGroup = Uniform.group(1, {
    entity: Uniform.buffer(0, Structs.PhongEntity),
});

export const Vertex = WebgpuUtils.createVertexBufferLayout('interleaved', {
    position: { format: 'float32x3', offset: 0 },
    uv: { format: 'float32x2', offset: 5 },
    normal: { format: 'float32x3', offset: 3 },
});

export const uniformsWgsl = Uniform.getWgslFromGroups([SceneUniformGroup, EntityUniformGroup]);