Viewed down-Event-page.container.tsx:1-100
Viewed down-Event-page.container.tsx:180-250

**`DownEventPage` 화면에서 렌더링되는 카드 개수**는 **데이터 페이징 단위**와 **가상 스크롤(Virtualization) DOM 렌더링** 2단계로 나누어 동작합니다.

---

### 1. 데이터 페이징 기준 (메모리 로드)
* **페이지 당 데이터 수 (`pageSize`)**: 기본 **`10개`** (페이지네이션에서 10, 20, 50, 100 선택 가능)
* 백엔드 API로부터 한 페이지에 해당하는 `pageSize`개(기본 10개)의 다운 이벤트 카드 목록을 가져옵니다.

---

### 2. 실제 화면(DOM) 렌더링 기준
전체 10개(또는 100개)가 브라우저 DOM에 한 번에 모두 렌더링되지 않고, **`TanStack Virtualizer`(`useVirtualizer`)를 통한 가상 스크롤**이 적용되어 있습니다.

```typescript
// src/pages/down-event/ui/down-Event-page.container.tsx
const rowVirtualizer = useVirtualizer({
  count: events.length,
  getScrollElement: () => scrollContainerRef.current,
  estimateSize: () => 480, // 카드 1개 예상 높이
  overscan: 2,             // 상/하단 버퍼 2개
});
```

* **실제 DOM에 마운트되는 카드 수**: **약 `3 ~ 6개`**
  - **화면 가시 영역 (Viewport)**: 모니터 높이에 따라 약 **`1 ~ 3개`** 노출
  - **오버스캔 버퍼 (`overscan: 2`)**: 스크롤 대비 상/하단 **`2 ~ 4개`**
* 스크롤을 내릴 때 화면 밖으로 벗어난 카드는 DOM에서 즉시 언마운트(제거)되고, 화면에 진입하는 카드만 동적으로 렌더링되어 대용량 이미지/HTML 렌더링 시에도 메모리와 성능을 최적 상태로 유지합니다.