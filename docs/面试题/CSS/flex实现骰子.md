# flex 实现骰子布局

<div style="display:flex;width: 80px;height: 80px;background: gray;justify-content:center;align-items:center;">
    <span style="width: 20px;height:20px;background: black;border-radius:20px;"></span>
</div>

```html
// justify-content:center + align-items: center
<div style="display:flex;justify-content:center;align-items:center;">
    <span></span>
</div>
```

<div style="display:flex;width: 80px;height: 80px;background: gray;justify-content:space-around;align-items:center;">
    <span style="width: 20px;height:20px;background: black;border-radius:20px;"></span>
    <span style="width: 20px;height:20px;background: black;border-radius:20px;"></span>
</div>

```html
// justify-content:space-between + align-items: center
<div style="display:flex;justify-content:space-between;align-items:center;">
    <span></span>
    <span></span>
</div>
```

<div style="display:flex;justify-content:center;width: 80px;height: 80px;background: gray;">
    <span style="align-self:flex-start;width: 20px;height:20px;background: black;border-radius:20px;"></span>
    <span style="align-self:center;width: 20px;height:20px;background: black;border-radius:20px;"></span>
     <span style="align-self:flex-end;width: 20px;height:20px;background: black;border-radius:20px;"></span>
</div>

```html
// align-self: flex-start/center/flex-end
<div style="display:flex;justify-content:space-between;align-items:center;">
    <span></span>
    <span></span>
    <span></span>
</div>
```

<div style="display:flex;flex-direction:column;justify-content: space-around;width: 80px;height: 80px;background: gray;">
    <div style="display:flex;justify-content: space-around;">
        <span style="width: 20px;height:20px;background: black;border-radius:20px;"></span>
    <span style="width: 20px;height:20px;background: black;border-radius:20px;"></span>
    </div>
<div style="display:flex;justify-content: space-around;">
        <span style="width: 20px;height:20px;background: black;border-radius:20px;"></span>
    <span style="width: 20px;height:20px;background: black;border-radius:20px;"></span>
    </div>
</div>

```html
// 爷：flex-direction: column;justify-content: space-around;
// 爸：justify-content:space-between * 2
<div style="display:flex;flex-direction: column;justify-content: space-around;">
    <div style="display:flex;justify-content: space-around;">
        <span></span>
        <span></span>
    </div>
    <div style="display:flex;justify-content: space-around;">
        <span></span>
        <span></span>
    </div>
</div>
```

<div style="display:flex;flex-direction:column;justify-content: space-around;width: 80px;height: 80px;background: gray;">
    <div style="display:flex;justify-content: space-around;">
        <span style="width: 20px;height:20px;background: black;border-radius:20px;"></span>
    <span style="width: 20px;height:20px;background: black;border-radius:20px;"></span>
    </div>
    <span style="align-self:center;width: 20px;height:20px;background: black;border-radius:20px;"></span>
<div style="display:flex;justify-content: space-around;">
        <span style="width: 20px;height:20px;background: black;border-radius:20px;"></span>
    <span style="width: 20px;height:20px;background: black;border-radius:20px;"></span>
    </div>
</div>

```html
// 爷：flex-direction: column;justify-content: space-around;
// 爸：justify-content:space-between * 2 + align-self: center;
<div style="display:flex;flex-direction: column;justify-content: space-around;">
    <div style="display:flex;justify-content: space-around;">
        <span></span>
        <span></span>
    </div>
    <span style="align-self:center;"></span>
    <div style="display:flex;justify-content: space-around;">
        <span></span>
        <span></span>
    </div>
</div>
```

<div style="display:flex;flex-direction:column;justify-content: space-around;width: 80px;height: 80px;background: gray;">
    <div style="display:flex;justify-content: space-around;">
        <span style="width: 20px;height:20px;background: black;border-radius:20px;"></span>
    <span style="width: 20px;height:20px;background: black;border-radius:20px;"></span>
    </div>
    <div style="display:flex;justify-content: space-around;">
        <span style="width: 20px;height:20px;background: black;border-radius:20px;"></span>
    <span style="width: 20px;height:20px;background: black;border-radius:20px;"></span>
    </div>
<div style="display:flex;justify-content: space-around;">
        <span style="width: 20px;height:20px;background: black;border-radius:20px;"></span>
    <span style="width: 20px;height:20px;background: black;border-radius:20px;"></span>
    </div>
</div>

```html
// 爷：flex-direction: column;justify-content: space-around;
// 爸：justify-content:space-between * 3
<div style="display:flex;flex-direction: column;justify-content: space-around;">
    <div style="display:flex;justify-content: space-around;">
        <span></span>
        <span></span>
    </div>
    <div style="display:flex;justify-content: space-around;">
        <span></span>
        <span></span>
    </div>
    <div style="display:flex;justify-content: space-around;">
        <span></span>
        <span></span>
    </div>
</div>
```

