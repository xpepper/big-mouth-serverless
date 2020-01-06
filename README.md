# A serverless demo app

Following Yan Cui's Serverless course: https://livevideo.manning.com/course/38/production-ready-serverless

## Logs

To watch logs I use awslogs.

E.g.

```shell
awslogs get /aws/lambda/big-mouth-ganzodigomma-dev-search-restaurants  ALL --watch
```
