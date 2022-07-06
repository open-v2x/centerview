import * as mqtt from 'mqtt';

export type MqttConnOpt = mqtt.IClientOptions;

export declare type OnMessageFunc = (topic: string, payload: Buffer) => void;

declare class Topic {
  public topic: string;
  public qos: 0 | 1 | 2;
}

export class MQTT {
  mqclient: mqtt.MqttClient | undefined;
  brokerUrl: string;
  subscribeTopics: Topic[];
  subscribeCallbacks: Map<string, OnMessageFunc>;

  constructor(host: string) {
    this.brokerUrl = host;
    this.subscribeTopics = new Array<Topic>();
    this.subscribeCallbacks = new Map<string, OnMessageFunc>();
  }

  /**
   * 订阅主题
   */
  public subscribe(topic: string, qos: 0 | 1 | 2) {
    this.subscribeTopics.push({ topic: topic, qos: qos });
    if (this.is_connected()) {
      this.mqclient?.subscribe(topic, { qos: qos });
    }
  }

  /**
   * 设置消息数据回调函数
   */
  public set_message_callback(topicPatten: string, cb: OnMessageFunc) {
    this.subscribeCallbacks.set(topicPatten, cb);
  }

  /**
   * 是否已连接到服务器
   */
  public is_connected() {
    return this.mqclient?.connected == true;
  }

  /**
   * 连接到服务器
   */
  public connect(opts?: MqttConnOpt) {
    this.mqclient = mqtt.connect(this.brokerUrl, opts);

    this.mqclient.on('connect', () => {
      for (let index = 0; index < this.subscribeTopics.length; index++) {
        const element = this.subscribeTopics[index];
        this.mqclient?.subscribe(element.topic, { qos: element.qos });
      }
    });

    this.mqclient.on('message', (topic: string, payload: Buffer) => {
      this.subscribeCallbacks.forEach((val, key) => {
        if (topic.indexOf(key) != -1) {
          val(topic, payload);
        }
      });
    });

    this.mqclient.on('error', () => {});
  }

  /**
   * 推送数据
   */
  public publish(topic: string, message: string, qos: 0 | 1 | 2) {
    this.mqclient?.publish(topic, message, { qos: qos, retain: false });
  }

  /**
   * 断开连接
   */
  public disconnect() {
    this.mqclient?.end(false);
  }
}
