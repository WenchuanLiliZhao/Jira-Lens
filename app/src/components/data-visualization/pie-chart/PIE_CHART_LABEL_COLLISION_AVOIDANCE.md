# Pie Chart 标签避让算法实现指南

## 问题背景

在使用 Recharts 或其他图表库绘制饼图时，当多个小切片连续出现时，标签会重叠在一起，导致数据难以阅读。

### 问题示例

```
       1.21%
      0.61%    <- 标签重叠！
     13.33%
```

## 解决方案

采用 **双列布局 + 引导线** 的标签避让算法：

1. 将所有标签分为左右两组
2. 每组标签固定在一条垂直线上
3. 检测并解决垂直方向的重叠
4. 使用引导线连接标签与对应的切片

### 效果示例

```
                  ·─────── 1.21%
                 /
    ●───────────·
                 \
                  ·─────── 0.61%
```

## 核心算法

### 1. 类型定义

```typescript
interface LabelData {
  index: number;
  x: number;           // 标签 X 坐标（固定在垂直线上）
  y: number;           // 标签 Y 坐标（可调整以避免重叠）
  originalX: number;   // 饼图边缘 X（引导线起点）
  originalY: number;   // 饼图边缘 Y（引导线起点）
  value: number;
  unit?: string;
  textAnchor: "start" | "end";  // 左侧用 "end"，右侧用 "start"
  cx: number;          // 圆心 X
  cy: number;          // 圆心 Y
  midAngle: number;    // 切片中间角度
  outerRadius: number;
}
```

### 2. 配置参数

```typescript
const DefaultDesignProperties = {
  // 标签最小垂直间距（像素）
  minLabelGap: 14,
  
  // 标签距离圆心的半径倍数（标签列位置）
  labelRadiusOuter: 1.35,
  
  // 引导线肘部距离圆心的半径倍数
  labelRadiusMiddle: 1.15,
};
```

### 3. 核心算法实现

```typescript
const RADIAN = Math.PI / 180;

const calculateLabelPositions = (
  data: Array<{ value: number; unit?: string }>,
  cx: number,      // 圆心 X
  cy: number,      // 圆心 Y
  outerRadius: number,
  startAngle: number  // 通常为 90（从顶部开始）
): LabelData[] => {
  const labelRadius = outerRadius * 1.35;  // 标签列位置
  const minGap = 14;  // 最小间距

  // 计算总值
  const total = data.reduce((sum, d) => sum + d.value, 0);
  if (total === 0) return [];

  // 固定的标签列 X 坐标
  const rightLabelX = cx + labelRadius;
  const leftLabelX = cx - labelRadius;

  // 计算每个标签的初始位置
  let currentAngle = startAngle;
  const labels: LabelData[] = data.map((d, i) => {
    const sliceAngle = (d.value / total) * 360;
    const midAngle = currentAngle - sliceAngle / 2;
    currentAngle -= sliceAngle;

    // 角度归一化到 0-360
    const normalizedAngle = ((midAngle % 360) + 360) % 360;
    
    // 判断左右侧
    // 90° 是顶部，0° 是右侧，180° 是左侧，270° 是底部
    const isRightSide = normalizedAngle >= 270 || normalizedAngle <= 90;
    
    // Y 坐标基于角度计算
    const y = cy + labelRadius * Math.sin(-midAngle * RADIAN);
    
    // X 坐标固定在列位置
    const x = isRightSide ? rightLabelX : leftLabelX;
    
    // 饼图边缘位置（引导线起点）
    const originalX = cx + outerRadius * Math.cos(-midAngle * RADIAN);
    const originalY = cy + outerRadius * Math.sin(-midAngle * RADIAN);

    return {
      index: i,
      x,
      y,
      originalX,
      originalY,
      value: d.value,
      unit: d.unit,
      textAnchor: isRightSide ? "start" : "end",
      cx,
      cy,
      midAngle,
      outerRadius,
    };
  });

  // 分组
  const rightLabels = labels.filter((l) => l.textAnchor === "start");
  const leftLabels = labels.filter((l) => l.textAnchor === "end");

  // 碰撞解决函数
  const resolveCollisions = (group: LabelData[]) => {
    if (group.length <= 1) return;

    // 按 Y 坐标排序
    group.sort((a, b) => a.y - b.y);

    // 推开重叠的标签
    for (let i = 1; i < group.length; i++) {
      const prev = group[i - 1];
      const curr = group[i];
      const gap = curr.y - prev.y;

      if (gap < minGap) {
        curr.y = prev.y + minGap;
      }
    }

    // 尝试将标签组居中（可选优化）
    const totalY = group.reduce((sum, l) => sum + l.y, 0);
    const avgY = totalY / group.length;
    const offset = cy - avgY;

    if (Math.abs(offset) > 2) {
      const canShift = group.every((_, i) => {
        if (i === 0) return true;
        return group[i].y + offset - (group[i - 1].y + offset) >= minGap;
      });

      if (canShift) {
        group.forEach((l) => {
          l.y += offset * 0.5;
        });
      }
    }
  };

  resolveCollisions(rightLabels);
  resolveCollisions(leftLabels);

  return [...rightLabels, ...leftLabels];
};
```

### 4. 渲染实现（React + SVG）

```tsx
// 在组件中使用
const labelPositions = React.useMemo(() => {
  return calculateLabelPositions(chartData, cx, cy, outerRadius, 90);
}, [chartData, cx, cy, outerRadius]);

// 渲染标签层
<g className="label-layer">
  {labelPositions.map((label) => {
    // 引导线肘部位置
    const elbowRadius = label.outerRadius * 1.15;
    const isRightSide = label.textAnchor === "start";
    const elbowX = isRightSide
      ? label.cx + elbowRadius
      : label.cx - elbowRadius;

    return (
      <g key={`label-${label.index}`}>
        {/* 引导线 */}
        <polyline
          points={`${label.originalX},${label.originalY} ${elbowX},${label.y} ${label.x},${label.y}`}
          fill="none"
          stroke="#999"
          strokeWidth={1}
        />
        {/* 标签文字 */}
        <text
          x={label.x}
          y={label.y}
          fill="#666"
          textAnchor={label.textAnchor}
          dominantBaseline="central"
          fontSize={10}
        >
          {label.value}{label.unit}
        </text>
      </g>
    );
  })}
</g>
```

## 关键设计决策

### 为什么使用双列布局而不是圆弧布局？

| 方案 | 优点 | 缺点 |
|------|------|------|
| **圆弧布局** | 标签与切片距离相等 | 小切片标签容易重叠，调整后位置混乱 |
| **双列布局** ✓ | 标签整齐，易于阅读 | 需要引导线连接 |

### 引导线设计

引导线采用三段折线设计：
1. **起点**：饼图边缘（切片中间角度位置）
2. **肘部**：与标签同一高度，在更靠近圆心的位置
3. **终点**：标签位置

```
起点 ●──────────●───────────● 终点（标签）
              肘部
```

### 参数调优建议

| 参数 | 建议值 | 说明 |
|------|--------|------|
| `minLabelGap` | 12-16px | 标签最小间距，取决于字体大小 |
| `labelRadiusOuter` | 1.3-1.5 | 标签列距离，值越大标签离饼图越远 |
| `labelRadiusMiddle` | 1.1-1.2 | 引导线肘部位置，应小于 labelRadiusOuter |

## 在 Recharts 中集成

### 关闭 Recharts 自带的 label

```tsx
<Pie
  data={chartData}
  label={false}  // 关闭自带 label
  labelLine={false}
  // ... 其他配置
>
```

### 添加自定义标签层

在 `<PieChart>` 内部添加一个 `<g>` 元素来渲染自定义标签。

## 完整示例

参考文件：
- `src/ambassador-one-page/components/widgets/widet-components/pie-chart/_BasePieChart.tsx`

## 其他图表库适配

### ECharts

ECharts 内置了标签避让功能，可以通过配置启用：

```javascript
option = {
  series: [{
    type: 'pie',
    label: {
      position: 'outside',
      alignTo: 'labelLine',  // 标签对齐到引导线
      bleedMargin: 5,
    },
    labelLine: {
      length: 15,
      length2: 10,
    },
    labelLayout: {
      hideOverlap: true,  // 隐藏重叠标签
    },
  }]
};
```

### D3.js

D3 需要手动实现类似逻辑，可以使用 `d3-labeler` 插件或参考本文档的算法。

---

## 总结

1. **双列布局**是解决饼图标签重叠的可靠方案
2. **引导线**是连接标签和切片的必要元素
3. **碰撞检测**采用简单的 Y 坐标比较即可
4. **参数可调**以适应不同的设计需求

此方案已在生产环境验证，适用于任何基于 SVG 的图表库。
