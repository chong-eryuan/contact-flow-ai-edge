
// 模拟客户数据
export const mockClients = [
  {
    id: "1",
    name: "张三",
    email: "zhangsan@example.com",
    status: "潜在",
    last_contact: "2024-05-20T10:00:00Z",
    follow_up_days: 7
  },
  {
    id: "2", 
    name: "李四",
    email: "lisi@example.com",
    status: "已成交",
    last_contact: "2024-05-25T14:30:00Z",
    follow_up_days: 14
  },
  {
    id: "3",
    name: "王五",
    email: "wangwu@example.com", 
    status: "冷淡",
    last_contact: "2024-05-15T09:15:00Z",
    follow_up_days: 30
  },
  {
    id: "4",
    name: "赵六",
    email: "zhaoliu@example.com",
    status: "潜在",
    last_contact: "2024-05-10T16:45:00Z",
    follow_up_days: 5
  },
  {
    id: "5",
    name: "钱七",
    email: "qianqi@example.com",
    status: "已成交",
    last_contact: "2024-05-22T11:20:00Z",
    follow_up_days: 21
  }
];

// 模拟联系记录数据
export const mockInteractions = [
  {
    id: "1",
    client_id: "1",
    type: "通话",
    content: "初次接触，了解客户需求。客户对我们的产品很感兴趣，希望能够得到更详细的方案介绍。",
    created_at: "2024-05-20T10:00:00Z"
  },
  {
    id: "2",
    client_id: "1", 
    type: "邮件",
    content: "发送了详细的产品方案和报价单，等待客户反馈。",
    created_at: "2024-05-21T09:30:00Z"
  },
  {
    id: "3",
    client_id: "2",
    type: "会议",
    content: "与客户进行了1小时的产品演示，客户非常满意，当场签署了合作协议。",
    created_at: "2024-05-25T14:30:00Z"
  },
  {
    id: "4",
    client_id: "2",
    type: "邮件",
    content: "发送合同和后续服务安排，欢迎客户加入我们的服务体系。",
    created_at: "2024-05-25T16:00:00Z"
  },
  {
    id: "5",
    client_id: "3",
    type: "通话",
    content: "客户表示暂时没有采购计划，建议3个月后再次联系。",
    created_at: "2024-05-15T09:15:00Z"
  }
];

// 模拟AI请求历史数据
export const mockAiRequests = [
  {
    id: "1",
    user_id: "demo-user",
    prompt: "帮我分析一下最近一个月的客户跟进情况，有哪些客户需要重点关注？",
    response: "根据您的客户数据分析，以下客户需要重点关注：\n\n1. 张三 - 潜在客户，上次联系已过7天，建议主动跟进\n2. 赵六 - 潜在客户，距离上次联系已超过预设跟进时间\n\n建议优先联系这些客户，了解他们的最新需求和决策进展。",
    created_at: "2024-05-27T10:30:00Z"
  },
  {
    id: "2", 
    user_id: "demo-user",
    prompt: "请为我生成一个适合发给潜在客户的跟进邮件模板",
    response: "以下是一个专业的客户跟进邮件模板：\n\n主题：关于您的项目需求 - 后续跟进\n\n尊敬的[客户姓名]，\n\n希望您一切都好！\n\n我是[您的姓名]，之前我们讨论过关于[具体项目/产品]的合作机会。我想跟进一下您目前的考虑情况。\n\n如果您有任何问题或需要更多信息，我随时为您提供帮助。我们也可以安排一个简短的电话会议来进一步讨论。\n\n期待您的回复。\n\n此致\n敬礼\n\n[您的姓名]\n[联系方式]",
    created_at: "2024-05-26T15:45:00Z"
  },
  {
    id: "3",
    user_id: "demo-user", 
    prompt: "分析一下我的客户转化率，给出改进建议",
    response: "基于您当前的客户数据分析：\n\n转化率情况：\n- 总客户数：5\n- 已成交：2（40%）\n- 潜在客户：2（40%）\n- 冷淡客户：1（20%）\n\n改进建议：\n1. 40%的转化率已经相当不错，继续保持\n2. 对潜在客户加强跟进频率，缩短决策周期\n3. 对冷淡客户采用不同策略，可以定期发送价值内容维持关系\n4. 建立更系统的客户培育流程",
    created_at: "2024-05-25T09:20:00Z"
  }
];
