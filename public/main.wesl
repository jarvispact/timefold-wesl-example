import package::vertex::{Vertex};
import package::uniforms::{Scene, Entity};

@group(0) @binding(0) var<uniform> scene: Scene;
@group(1) @binding(0) var<uniform> entity: Entity;
 
struct VSOutput {
  @builtin(position) position: vec4f,
  @location(0) uv: vec2f,
  @location(1) normal: vec3f,
  @location(2) world_pos: vec3f,
};

@vertex fn vs(
  vert: Vertex
) -> VSOutput {
    var vsOut: VSOutput;
    let world_pos = entity.transform.model_matrix * vec4f(vert.position, 1.0);
    vsOut.position = scene.camera.view_projection_matrix * world_pos;
    vsOut.uv = vert.uv;
    vsOut.normal = (entity.transform.normal_matrix * vec4f(vert.normal, 0.0)).xyz;
    vsOut.world_pos = world_pos.xyz;
    return vsOut;
}

@fragment fn fs(vsOut: VSOutput) -> @location(0) vec4f {
    let N = normalize(vsOut.normal);

    var diffuse_color = entity.material.diffuse_color;

    let ambientFactor = 0.1;
    let ambient = diffuse_color * ambientFactor;

    var lighting = vec3f(0.0, 0.0, 0.0);

    for (var i = 0; i < 3; i++) {
        let L = normalize(scene.dirLights[i].direction);

        let diff = max(dot(N, L), 0.0);
        let diffuse = diff * scene.dirLights[i].color * scene.dirLights[i].intensity * diffuse_color;
    
        let view_dir = normalize(scene.camera.position - vsOut.world_pos);
        let halfway_dir = normalize(L + view_dir);
        let spec = pow(max(dot(N, halfway_dir), 0.0), 512.0);
        let specular = spec * scene.dirLights[i].color * scene.dirLights[i].intensity * entity.material.specular_color;

        lighting += (diffuse + specular);
    }

    return vec4f(ambient + lighting, entity.material.opacity);
}