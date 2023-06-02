import { ElMessage, MessageHandler, MessageParams } from "element-plus";
import { h } from "vue";

let messageHandle: MessageHandler;

function message(options: MessageParams, icon: string) {
  messageHandle?.close();
  const opts = typeof options === "string" ? { message: options } : options;
  messageHandle = ElMessage(Object.assign({ offset: 16, type: icon }, opts));
}

export function Message(options: MessageParams) {
  Message.info(options);
}

Message.success = function (options: MessageParams) {
  message(options, "success");
};

Message.error = function (options: MessageParams) {
  message(options, "error");
};

Message.info = function (options: MessageParams) {
  message(options, "info");
};
