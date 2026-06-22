# Axis ACP DevKit：Gate 00～07 最终统一 Review 索引

> 生成日期：2026-08-20
>
> 当前状态：Gate 00 已由用户明确通过；Gate 01～07 已按顺序完成实现、独立测试与 Review Pack，等待用户最终统一 Review。
>
> 约束：Commit Message 只描述技术变更；Gate 编号、范围与 Commit 映射只保存在本机 Review 文档。

## 1. Gate 状态与 Commit 映射

| Gate                   | Review Pack                       | 技术/文档 Commit                                                 | 当前人工结论            |
| ---------------------- | --------------------------------- | ---------------------------------------------------------------- | ----------------------- |
| 00 产品定位            | `gate-00-positioning.md`          | `f93c1aa`, `430d4de`                                             | 已通过                  |
| 01 仓库边界            | `gate-01-repository-boundary.md`  | `1609fc8`                                                        | 实现完成，待统一 Review |
| 02 Harness 安全        | `gate-02-harness-security.md`     | `dc7fc4a`, `5d72df5`, `caf4058`, `77dae7f`                       | 实现完成，待统一 Review |
| 03 Trace/Event         | `gate-03-trace-event-model.md`    | `a1a9c43`, `b42d7d3`, `c69388d`                                  | 实现完成，待统一 Review |
| 04 Session/Cancel      | `gate-04-session-cancel.md`       | `9c1ffa6`, `62e8677`, `6b59e17`, `6623e56`, `6fddf54`            | 实现完成，待统一 Review |
| 05 Scenario/Diagnostic | `gate-05-scenario-diagnostics.md` | `1d95ebc`, `b2af77f`, `0b5dcb1`                                  | 实现完成，待统一 Review |
| 06 Transcript/Replay   | `gate-06-replay.md`               | `087a5d9`, `9c54779`, `d262319`                                  | 实现完成，待统一 Review |
| 07 DevTools/Real Agent | `gate-07-devtools-real-agent.md`  | `a90b80f`, `ceb3ae2`, `ce30a83`, `a554449`, `fdc924d`, `f99bddd` | 实现完成，待统一 Review |

执行授权调整属于跨 Gate 治理记录，不算技术能力 Commit：

```text
75b7bc6 docs(gate-00): allow atomic commit series
a396f13 docs: map review gates outside commit messages
```

`75b7bc6` 是授权调整前留下的历史命名；自 `a396f13` 起已执行“Commit Message 不写 Gate 标签”的规则。2026-08-21 重写提交日期及主线基底后，本索引已同步为新的 Hash。

## 2. 独立检出与回滚范围

以下命令只读展示某个 Gate 的累计变化：

```bash
# Gate 01
git diff 1609fc8^..1609fc8

# Gate 02
git diff dc7fc4a^..77dae7f

# Gate 03
git diff a1a9c43^..c69388d

# Gate 04
git diff 9c1ffa6^..6fddf54

# Gate 05
git diff 1d95ebc^..0b5dcb1

# Gate 06
git diff 087a5d9^..d262319

# Gate 07（含 Review Pack 和演示资产）
git diff a90b80f^..f99bddd
```

若要在不移动当前分支的情况下运行旧 Gate，推荐创建临时 worktree：

```bash
git worktree add /tmp/axis-gate-04 6fddf54
pnpm --dir /tmp/axis-gate-04 install --frozen-lockfile
pnpm --dir /tmp/axis-gate-04 test:contract
git worktree remove /tmp/axis-gate-04
```

直接 `git checkout <hash>` 会进入 detached HEAD；统一 Review 时可以使用，但不要在其中混入未保存修改。任何回滚前先执行 `git status --short`。

## 3. 最终验证基线

2026-08-20 在 `f99bddd` 前的完整实现树上执行：

```bash
pnpm lint
pnpm type-check
pnpm test:ci
pnpm build:all
pnpm check:publish
pnpm test:smoke
pnpm docs:build
```

最终结果：

```text
lint: PASS
type-check: PASS
test files: 31 passed
tests: 176 passed
coverage: statements 80.00%, branches 68.19%, functions 84.90%, lines 81.00%
Chromium browser project: PASS
OpenCode 1.14.48 real-agent initialize contract: PASS
build:all: PASS
publint + attw: PASS（既定 esm-only profile）
tarball smoke: PASS
VitePress docs build: PASS
```

`check:publish` 与 `test:smoke` 在受限沙箱第一次因 npm 用户缓存不可写失败；允许使用现有用户缓存后原命令通过。该问题未导致源码或包配置修改。

最终 CLI 实跑：

```text
fixture cancel-during-permission: passed
traceCount: 11
eventCount: 13
replay sequence: 24
integrityValid: true
OpenCode: 1.14.48
OpenCode traceCount/eventCount: 2/5
OpenCode activeProcesses: 0
```

## 4. 推荐统一 Review 顺序

### 第一轮：产品和边界（约 10 分钟）

1. 阅读 Gate 00 的 30 秒/2 分钟定位。
2. 阅读 Gate 01 的 Workspace、private package 和发布 Allowlist。
3. 确认 DevKit 没有改变 `axis-ui`、`@axis-ui/utils`、`@axis-ui/theme-chalk` 的公开发布范围。

### 第二轮：主运行链路（约 20 分钟）

1. Gate 02：Target Registry→Process Group→Official SDK→Local Bridge。
2. Gate 03：Transport Tap→Raw Frame→Adapter→AxisAcpEvent。
3. Gate 04：Session Reducer 与 Permission Pending Cancel 时序。
4. Gate 05：三个 Scenario、两个 Profile、七条 Invariant 与责任分类。

### 第三轮：证据与产品化（约 20 分钟）

1. Gate 06：Transcript 脱敏、纯事件 Replay 与 State Hash。
2. Gate 07：CLI/HTML、Workbench、VirtualList 反哺与真实 OpenCode initialize。
3. 播放 `docs/public/demos/axis-acp-devtools.webm`，再按 Gate 07 Demo 路径亲自操作一次。

### 第四轮：模拟面试（约 20 分钟）

按方案的最终 Mock Interview：

```text
2 分钟项目介绍
5 分钟架构深挖
5 分钟 Cancel / Permission 故障案例
5 分钟安全、测试与 Replay 追问
3 分钟 Axis-UI 反哺与项目复盘
```

当前按用户授权跳过口头讲解和逐题追问；所有问题、参考答案、两层追问和常见错误回答已保留在各 Review Pack，供用户自主学习。人工结论仍不能由自动化替代。

## 5. 主 Demo 快捷路径

```bash
pnpm build:all

node packages/acp-cli/dist/main.js run \
  --target fixture-agent \
  --scenario cancel-during-permission \
  --workspace . \
  --output /tmp/axis-acp-demo

node packages/acp-cli/dist/main.js replay \
  --input /tmp/axis-acp-demo/fixture-agent-cancel-during-permission.axis-acp.json

node packages/acp-cli/dist/main.js inspect --target opencode --workspace .
```

UI 需要两个终端：

```bash
node packages/acp-cli/dist/main.js serve --origin http://127.0.0.1:5173
pnpm --filter @axis-ui/acp-devtools dev
```

用 Bridge 输出的随机 URL/Token 组装本机页面参数；Token 不要写入仓库、截图、日志文档或 Commit。

## 6. 最终能力边界

Gate 01～07 的实现闭环已经完成，但仍应区分“Gate 计划”与方案中的长期候选池：

- 已完成：ACP v1 stdio、固定安全 Target、官方 SDK、Raw/Event 双模型、Session/Cancel、三个固定 Scenario、两个 Profile、七条 Invariant、Transcript/Replay、CLI、单次 JSON/HTML、DevTools、OpenCode initialize、README 与 Demo 视频。
- Gate 05 已明确不包含三个独立、通用化的 Fault Injector Pack。当前 Crash 有合同测试，Permission Pending 与 Unsupported Terminal 是固定 Scenario 注入；独立 Permission Timeout 和 Update Delay 注入器仍未实现。
- 未完成：完整 ACP v1/v2、远程 Transport、通用 Scenario Marketplace、完整 Fault Matrix、多 Run Dashboard、云端协作、官方认证、真实模型确定性、审计级数字签名。

因此统一 Review 通过后，可表述“完成 Gate 01～07 定义的 M2-Core 学习闭环”；不能把长期候选或未实现的独立 Fault Pack 一并写成完成事实。

## 7. 最终人工结论记录区

统一 Review 后，由用户填写：

```text
Gate 01：通过 / 未通过；备注：
Gate 02：通过 / 未通过；备注：
Gate 03：通过 / 未通过；备注：
Gate 04：通过 / 未通过；备注：
Gate 05：通过 / 未通过；备注：
Gate 06：通过 / 未通过；备注：
Gate 07：通过 / 未通过；备注：
最终 Mock Interview：通过 / 未通过；备注：
```

只有用户的明确回复才改变上述人工状态；本索引不自动批准任何 Gate。
