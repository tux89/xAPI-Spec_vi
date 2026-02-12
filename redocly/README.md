# xAPI OpenAPI Docs Project

Thư mục này chứa dự án OpenAPI để sinh API docs từ chuẩn xAPI trong `xAPI_vi.md`.

## Phạm vi

- Bao phủ các endpoint bắt buộc trong Appendix F:
  - `statements`
  - `agents`
  - `agents/profile`
  - `activities`
  - `activities/profile`
  - `activities/state`
  - `about`
- Có thêm các endpoint OAuth (`OAuth/initiate`, `OAuth/authorize`, `OAuth/token`) để tham chiếu khi LRS triển khai OAuth 1.0.
- Mô tả header/version/concurrency theo section 6-7.
- Schema đã được chi tiết theo section 4 cho các object chính:
  - `StatementRequest`, `StatementResponse`, `StatementResult`, `SubStatement`, `StatementRef`
  - `Agent`, `Group`, `Person`, `Account`
  - `Verb`, `Activity`, `ActivityDefinition`, interaction components
  - `Result`, `Score`, `Context`, `ContextActivities`, `Attachment`
- Normative mode cho Statement:
  - `StatementRequest`: shape cho ghi dữ liệu vào LRS.
  - `StatementResponse`: shape khi LRS trả dữ liệu (bao gồm `stored`, `authority`, `version` bắt buộc).
- Strict validation mode cho `GET /statements`:
  - `format=exact` -> `StatementResponseExact` / `StatementResultExact`
  - `format=canonical` -> `StatementResponseCanonical` / `StatementResultCanonical`
  - `format=ids` -> `StatementResponseIds` / `StatementResultIds`
  - Ràng buộc sâu cho `Verb`, `ActivityDefinition`, `Context` theo từng format (đặc biệt canonical language maps và ids minimal identifiers).
- Đã thêm nhiều ví dụ request/response thực tế theo từng endpoint chính để dễ tích hợp.
- Đây vẫn là OpenAPI docs-centric spec (không thay thế bộ test conformance chính thức của xAPI).

## Chạy local

### Với pnpm (mặc định)

```bash
cd openapi
pnpm install
pnpm lint
pnpm build
pnpm preview
```

### Với Bun (tuỳ chọn)

```bash
cd openapi
bun install
bun run lint
bun run build
bun run preview
```

- File build ra tại: `openapi/dist/index.html`
- Preview mặc định chạy tại cổng `8080`.

## Bật Try it (Replay)

Project đã thêm `openapi/redocly.yaml` với cấu hình:

- `theme.openapi.hideReplay: false` để hiển thị panel `Try it` trong Redocly docs.
- `extends: recommended` để giữ bộ rule lint mặc định của Redocly CLI.

Lưu ý:

- Nếu CLI báo `Using Redoc community edition`, tính năng `Replay/Try it` có thể không hiển thị.
- Khi đó cần `redocly login` hoặc dùng enterprise license key của Redocly để preview bản docs premium.

Để test request trực tiếp trên trình duyệt:

1. Chỉnh `servers` trong `openapi/openapi.yaml` sang URL LRS thật (hoặc local) của bạn.
2. Đảm bảo LRS cho phép CORS từ domain docs (hoặc chạy docs cùng origin).
3. Chạy `pnpm preview` (hoặc `bun run preview`) và mở docs để dùng `Try it`.

## File chính

- `openapi/openapi.yaml`: OpenAPI spec.
- `openapi/package.json`: scripts lint/build/preview bằng Redocly.
