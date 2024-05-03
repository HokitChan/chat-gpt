export interface DefaultParamsInterface {
    model: string;
    messages: MessageInterFace[]; // 整个messages数组是可选的
}

export interface MessageInterFace {
    role: string;
    content: string;
}