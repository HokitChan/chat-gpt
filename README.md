# 项目名称

本项目是一个基于 React 的对话式应用程序，用于与 OpenAI GPT-3.5 Turbo 模型进行交互。

## 功能特点

- 与 OpenAI GPT-3.5 Turbo 模型进行交互，实现对话式应用程序
- 支持输入 API 密钥，并在对话中使用该密钥进行请求
- 实时显示用户输入和模型的响应
- 显示请求失败或网络错误的提示信息

## 项目结构

- `App`：应用程序的根组件
  - `components`：包含对话框、输入框、弹窗等组件
    - `ContentComponent`：对话框组件，用于显示对话内容
    - `InputComponent`：输入框组件，用于接收用户输入
    - `DialogComponent`：弹窗组件，用于输入用户 api 密钥
    - `CustomizedSnackbars`：自定义的 Snackbar 组件，用于显示错误提示信息
## 技术栈

- React
- TypeScript
- Material-UI

## 安装和使用

1：安装依赖：

### `npm install`

### `yarn install`

2：运行应用程序：

### `npm start`

3：打包构建

### `npm run build`

