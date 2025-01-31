import { createPlugin, createSystem } from "@timefold/ecs";
import { RenderPassDescriptor, WebgpuUtils } from "@timefold/webgpu";
import { cubeVertices, stride } from "./cube";
import { world, World } from "./world";
import { EntityUniformGroup, SceneUniformGroup, Vertex } from "./shader";
import { getFinalWgsl } from "./wesl";

export const createRenderPlugin = async (canvas: HTMLCanvasElement) => {
  const { context, device, format } = await WebgpuUtils.createDeviceAndContext({
    canvas,
  });
  const module = device.createShaderModule({ code: getFinalWgsl() });

  const { layout, createBindGroups } = WebgpuUtils.createPipelineLayout({
    device,
    uniformGroups: [SceneUniformGroup, EntityUniformGroup],
  });

  const scene = createBindGroups(0, {
    scene: WebgpuUtils.createBufferDescriptor(),
  });

  const vertexBuffer = device.createBuffer({
    label: "vertex buffer vertices",
    size: cubeVertices.buffer.byteLength,
    usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
  });

  const vertexCount = cubeVertices.length / stride;
  device.queue.writeBuffer(vertexBuffer, 0, cubeVertices.buffer);

  const renderPassDescriptor: RenderPassDescriptor = {
    label: "canvas renderPass",
    colorAttachments: [
      WebgpuUtils.createColorAttachmentFromView(
        context.getCurrentTexture().createView()
      ),
    ],
  };

  const pipeline = device.createRenderPipeline({
    label: "pipeline",
    layout,
    primitive: { cullMode: "back" },
    vertex: { module: module, buffers: Vertex.layout },
    fragment: { module: module, targets: [{ format }] },
  });

  const query = world.createQuery(
    {
      tuple: [
        { has: "@tf/Data" },
        { has: "@tf/Transform", include: false },
        { has: "@tf/PhongMaterial", include: false },
      ],
    },
    {
      map: ([data]) => {
        const { bindGroup, buffers } = createBindGroups(1, {
          entity: WebgpuUtils.createBufferDescriptor(),
        });

        return {
          bindGroup,
          buffer: buffers.entity,
          data: data.data,
        };
      },
    }
  );

  const sceneCreateResult = world.getResource("scene").data;

  const render = () => {
    renderPassDescriptor.colorAttachments[0].view = context
      .getCurrentTexture()
      .createView();

    const encoder = device.createCommandEncoder();
    const pass = encoder.beginRenderPass(renderPassDescriptor);

    pass.setPipeline(pipeline);
    pass.setVertexBuffer(0, vertexBuffer);

    pass.setBindGroup(0, scene.bindGroup);
    device.queue.writeBuffer(scene.buffers.scene, 0, sceneCreateResult.buffer);

    for (const item of query) {
      pass.setBindGroup(1, item.bindGroup);
      device.queue.writeBuffer(item.buffer, 0, item.data);
      pass.draw(vertexCount);
    }

    pass.end();
    device.queue.submit([encoder.finish()]);
  };

  const RenderSystem = createSystem({ stage: "render", fn: render });

  return createPlugin<World>({
    fn: (world) => {
      world.registerSystems(RenderSystem);
    },
  });
};
