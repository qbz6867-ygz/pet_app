const getWindowMetrics = () => {
  try {
    if (typeof wx !== 'undefined' && typeof wx.getWindowInfo === 'function') {
      return wx.getWindowInfo()
    }
    return uni.getSystemInfoSync()
  } catch (error) {
    return {}
  }
}

const getMenuButtonRect = () => {
  try {
    if (typeof wx !== 'undefined' && typeof wx.getMenuButtonBoundingClientRect === 'function') {
      const rect = wx.getMenuButtonBoundingClientRect()
      if (rect && rect.top >= 0 && rect.height > 0 && rect.bottom > rect.top) return rect
    }
  } catch (error) {
    // Use the platform-safe fallback below when the capsule API is unavailable.
  }

  const windowInfo = getWindowMetrics()
  const statusBarHeight = Number(windowInfo.statusBarHeight) || 20
  const windowWidth = Number(windowInfo.windowWidth) || 375
  const top = statusBarHeight + 7
  const height = 32
  return {
    top,
    bottom: top + height,
    height,
    width: 87,
    right: windowWidth - 7,
    left: windowWidth - 94
  }
}

export const getNavigationMetrics = () => {
  const menuButton = getMenuButtonRect()
  const windowInfo = getWindowMetrics()
  const windowWidth = Number(windowInfo.windowWidth) || 375
  const horizontalPadding = windowWidth * 40 / 750
  const minimumSideColumn = windowWidth * 156 / 750
  const bottomSpacing = 10
  const sideColumnWidth = Math.max(
    minimumSideColumn,
    windowWidth - menuButton.left - horizontalPadding
  )
  return {
    menuButton,
    bottomSpacing,
    barHeight: menuButton.bottom + bottomSpacing,
    sideColumnWidth
  }
}

export const getNavigationStyle = () => {
  const { menuButton, bottomSpacing, barHeight, sideColumnWidth } = getNavigationMetrics()
  return {
    paddingTop: `${menuButton.top}px`,
    paddingBottom: `${bottomSpacing}px`,
    minHeight: `${barHeight}px`,
    '--menu-button-height': `${menuButton.height}px`,
    '--menu-side-width': `${sideColumnWidth}px`
  }
}
