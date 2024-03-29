# 国际化

- 框架支持国际化，默认支持英文、中文

## 代码位置

- 英文：`src/locales/en-US.json`
- 中文：`src/locales/zh-CN.json`

## 如何使用

- 代码中的需要国际化展示的字符串均使用英文，使用命令行完成字符采集后，无需更新 en.json 文件，只需要修改 zh.json 中对应的中文即可完成国际化的操作
- 对于需要国际化的字符串，使用`t`函数即可

  - 国际化写法为`t('Action')`
  - 注意，英文是大小写相关的
  - `t`函数支持带有参数的字符串

    - 参数使用`{}`标识，如

      ```javascript
      confirmContext = () =>
        t('Are you sure to { action }?', {
          action: this.actionName || this.title,
        });
      ```

- 采集

  ```shell
  grunt
  ```

  - 采集后，`en-US.json`与`zh-CN.json`文件会自动更新

- 更新中文
  - 采集后，直接在`zh-CN.json`中更新相应的中文翻译即可
