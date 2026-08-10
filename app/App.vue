<script>
export default {}
</script>

<style>
page {
  --paper: #ffffff;
  --surface: #fffcf7;
  --surface-strong: #fbf6ed;
  --line: rgba(107, 91, 82, 0.11);
  --line-soft: #eee5d8;
  --ink: #665247;
  --muted: #9b8778;
  --brand: #d5a765;
  --brand-dark: #9b6c46;
  --gold: #efcf91;
  --gold-soft: #f7e7c2;
  --peach: #e8a17f;
  --green: #4f8d67;
  --green-soft: #e4f3e9;
  background: #ffffff;
  color: var(--ink);
  font-family: -apple-system, BlinkMacSystemFont, "PingFang SC", "Microsoft YaHei", sans-serif;
  font-size: 28rpx;
}

view, text, image, button, input, textarea, picker, swiper, swiper-item {
  box-sizing: border-box;
}

button {
  margin: 0;
  padding: 0;
  font: inherit;
  color: inherit;
  background: none;
  border: 0;
}

button::after {
  border: 0;
}

.page {
  min-height: 100vh;
  background: var(--paper);
  padding: 0 40rpx calc(176rpx + env(safe-area-inset-bottom));
}

.page.no-tab {
  padding-bottom: calc(56rpx + env(safe-area-inset-bottom));
}

.section {
  margin-top: 30rpx;
}

.section-kicker {
  display: block;
  margin-bottom: 4rpx;
  color: var(--muted);
  font-size: 18rpx;
}

.section-title {
  color: var(--ink);
  font-size: 36rpx;
  font-weight: 500;
  line-height: 1.3;
}

.card {
  border: 1rpx solid var(--line);
  border-radius: 34rpx;
  background: var(--surface);
  box-shadow: 0 16rpx 48rpx rgba(115, 88, 60, 0.055);
}

.soft-card {
  border-radius: 28rpx;
  background: var(--surface-strong);
}

.primary-button,
.ghost-button,
.danger-button {
  min-height: 78rpx;
  border-radius: 24rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28rpx;
  font-weight: 600;
}

.primary-button {
  color: #ffffff;
  background: #9b6c46;
  box-shadow: 0 12rpx 26rpx rgba(155, 108, 70, 0.18);
}

.ghost-button {
  color: var(--brand-dark);
  border: 1rpx solid var(--line);
  background: #fffdfa;
}

.danger-button {
  color: #b45c50;
  border: 1rpx solid #e8c3bd;
  background: #fff8f6;
}

.field {
  min-height: 88rpx;
  padding: 0 26rpx;
  border: 1rpx solid var(--line);
  border-radius: 26rpx;
  background: var(--surface-strong);
  display: flex;
  align-items: center;
}

.field input,
.field textarea {
  width: 100%;
  color: var(--ink);
  font-size: 28rpx;
}

.field-placeholder {
  color: #b7a79a;
}

.row-between {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.muted {
  color: var(--muted);
}

.pill {
  display: inline-flex;
  min-height: 46rpx;
  padding: 0 18rpx;
  align-items: center;
  justify-content: center;
  border-radius: 999rpx;
  color: var(--brand-dark);
  background: var(--gold-soft);
  font-size: 22rpx;
}

.safe-bottom {
  height: env(safe-area-inset-bottom);
}
</style>
