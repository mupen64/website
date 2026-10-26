# Unreleased

Nothing yet.

# 7.0.0 

### ✨ Features

- Added support for wheel scrolling in scroll-overflowing containers

### 🐞 Bugfixes

- Fixed visual states being lost during transitions.

### ⛔ Breaking changes

#### Ugui types have `Ugui` prefix (non-runtime breaking)

All ugui types now use the `Ugui` prefix (e.g., `UguiToggleButton` instead of `ToggleButton`).

#### `UguiEnvironment` changed

The deprecated `UguiEnvironment.wheel` has now been wholly removed. So has `UguiEnvironment.is_primary_down`.

Supply `mouse_events` instead; users will get a better scrolling experience and you don't have to register atwindowmessage :)

# 6.1.0

### ✨ Features

- Added scroll overflow.
- Added transitions.
- Added `ugui.PREFERS_REDUCED_MOTION`.

### ⛔ Breaking changes

#### `UguiControl.clip_children` removed

`UguiControl.clip_children` has been replaced by `x_overflow` and `y_overflow`. Use those, they're better in every way.

# 6.0.0

### ✨ Features

- Made UIDs sibling-scoped

### 🐞 Bugfixes

- Fixed type checking for `UguiControl`

### ⛔ Breaking changes

#### `ugui.<type>_uids()` functions removed

These functions have been removed.

All controls now consume only one (1) UID slot, which greatly simplifies UID accounting.

#### Negative UIDs disallowed

Negative UIDs are now forbidden.

If you were using negative UIDs, change them to positive values.

This doesn't affect cases where you're authoring and control and using the internal API.

### 💡 Tips

#### Use sibling-scoped UIDs

UIDs are no longer scene-global, but scoped to their siblings, thereby making the following pattern legal:

```lua
ugui.panel({ uid = 1 }, function()
    ugui.button({ uid = 1 }) -- ✅ allowed and unique! :D
    ugui.button({ uid = 2 }) -- ✅ allowed and unique! :D
end))

ugui.panel({ uid = 2 }, function()
    ugui.button({ uid = 1 }) -- ✅ allowed and unique! :D
    ugui.button({ uid = 2 }) -- ✅ allowed and unique! :D
end))
```

# 5.1.0

### ✨ Features

- Added the `window` control.
- Added cut (Ctrl + X) action to textbox
- Added more icons.

### 🐞 Bugfixes

- Fixed broken slot order in spinner

# 5.0.0

### ✨ Features

- Added `opacity` property to `Control`.
- Added control nesting support.
- Improved the debug view (`ugui.DEBUG`)
- Added per-control instance drawing customization.
- Added the `colorpicker` control.
- Added user-defined hittesting support.
- Changed `menu` to only require one UID slot
- Added `Control.context_menu` and meta context menu result

### ⚡ Performance

- Improved rich text drawing performance
- Improved general styler performance

### 🐞 Bugfixes

- Fixed distorted rendering of the checkmark icon when width ≠ height
- Fixed broken multiline tooltip rendering
- Fixed tall tooltips being misaligned
- Fixed joystick lines extending beyond the circle when non-rectangular
- Fixed menu item icons being drawn with unexpected color and size

### ⛔ Breaking changes

#### `standard_styler.draw_rich_text` now takes a parameter table

`ugui.standard_styler.draw_rich_text` now accepts a single table instead of positional arguments. Move each argument into the matching named field (`rectangle`, `align_x`, `align_y`, `text`, `color`, `visual_state`, `plaintext`, `font_name`, `font_size`, `wrap`, `fit`, or `clip`). For example:

```diff
-ugui.standard_styler.draw_rich_text(rectangle, align_x, align_y, text, color, visual_state)
+ugui.standard_styler.draw_rich_text({
+    rectangle = rectangle,
+    align_x = align_x,
+    align_y = align_y,
+    text = text,
+    color = color,
+    visual_state = visual_state,
+})
```

#### `standard_styler.draw_icon` no longer has `visual_state` parameter

The `visual_state` parameter to `standard_styler.draw_icon` has been removed, and `UguiNinesliceStyle` was adjusted accordingly
to only have one rectangle per icon.

#### Various styler consolidations

The following functions have been removed from the `standard_styler`:

- `draw_button`
- `draw_togglebutton`
- `draw_carrousel_button`
- `draw_combobox`
- `draw_joystick_inner`

The following functions have gained a new `visual_state` parameter:

- `draw_textbox`
- `draw_joystick`

#### Removed `UguiDrawRichTextParams.visual_state`

The `visual_state` field was removed from `UguiDrawRichTextParams`.

If you were relying on ugui-side color lookps based on the visual state, do the lookup at the callsites.

#### `ControlRegistryEntry.uids` moved to `ugui.<type>_uids`

UID counts are now exposed through control-specific helpers, such as `ugui.button_uids()` instead of registry entries.

#### Dynamic UID changes

The `menu` control now has a static UID count, use just `ugui.menu_uids()`.

The `tabcontrol` now requires only an item count to be passed in to the UID computation function, not an entire control instance.

#### `ugui.control` and `ControlType` removed

`ugui.control` and the `ControlType` type have been removed; use the specific control functions (e.g. `ugui.button` or `ugui.label`) instead.

If you need dynamic runtime lookup, write your own map of type strings to control functions.

#### `Control` type renamed to `UguiControl` (non-runtime breaking)

The `Control` type has been renamed to `UguiControl`.

#### Control registry removed (control authors only)

The control registry has been removed. Controls are now implemented using custom placement functions with per-instance callbacks.

This only affects API consumers who implement their own controls.

**`ControlRegistryEntry.setup` moved to control placement**

Use the fourth argument to `ugui.internal.control` in the contro's placement function instead.

**`ControlRegistryEntry.hittestable` removed**

Apply the default value in the control's placement function instead.

**`ControlRegistryEntry.added` removed**

There is no built-in alternative to this API. Try to write controls in a way that doesn't require this kind of lifecycle notification.

**`ControlRegistryEntry.validate` removed**

If you need to implement control validation, do it in the control's placement function, e.g.:

**`ControlRegistryEntry.logic` moved to `Control.get_return_value`**

Control logic is now provided by the per-instance `Control.get_return_value` callback instead of `ControlRegistryEntry.logic`.

**`ControlRegistryEntry.draw` moved to `Control.draw`**

Draw control graphics in the `Control.draw` callback instead.

### 💡 Tips

#### Control nesting

Controls can now be nested, with child controls being positioned relative to their parents.

Many UI patterns benefit from establishing a hierarchy, so you'll want to check and introduce hierarchies where appropriate.

You can configure clipping behavior with `Control.clip_children`.

Some properties on `Control` are now inherited, read the API definition for more details.

#### Control types

The valid set of control types is no longer defined by ugui (cf. removal of `ugui.control` and `ControlType`).

Adding controls of arbitrary type to the registry is now fully supported, but note that this part of the public API is more volatile.

#### Context menus

Context menus are now supported natively using `Control.context_menu`.

If you were reimplementing them by hiding/showing menus based on mouse clicks, you can remove that in favor of the built-in functionality.

#### `tabcontrol` content

Thanks to the new control nesting, you can now display `tabcontrol` content simply by providing it with a child callback:

```lua
local result = ugui.tabcontrol({
    uid = ...,
    rectangle = ...,
    items = ...,
    selected_index = ...,
}, function()
    ugui.panel({
        uid = ...,
        rectangle = {
            x = 0,
            y = 0,
            width = 100,
            height = 100,
        },
        fill = '#FF00FF55',
    })
end)
```

Note that there is no way to determine the available dimensions for the content, as `result` is not available inside the callback.

# 4.0.0

### ✨ Features

- **core** Added global GUI scaling support (via `Environment.scale` in `ugui.begin_frame`).
- **core** Added per-control `fill`, `stroke`, `stroke_style`, and `border_radius` properties, as well as `background` support with various image properties.
- **core** Added `ControlRegistryEntry.uids()` to retrieve the number of UID slots reserved by a control instance.
- **core** Added `mouse_events` to `Environment`.
- **panel** Added a panel control.
- **core** Added a debug view showing frametime, FPS, and hot logic/draw controls when `ugui.DEBUG = true`.
- **label** Added `wrap`, `clip`, and `fit` parameters, including wrapping and fitting support for rich text.
- **label** Made labels non-hittestable by default.
- **combobox** Added editing and filtering support through the `editable` field.
- **combobox** Added keyboard support for editable comboboxes and configurable signal and selected-index change behavior.
- **spinner** Materialized as a real control.
- **tabcontrol** Materialized as a real control.
- **listbox** Improved scrolling and selection behavior.
- **textbox** Improved Ctrl+Backspace behavior.
- **textbox** Added delete key support.
- **textbox** Improved navigation (Shift+Click, Shift+arrow keys).
- **textbox** Added undo/redo.
- **textbox** Added double and triple click selection extending.
- **textbox** Made caret blink reset when typing.
- **textbox** Added `text_x_align`.
- **textbox** Added horizontal scrolling.
- **numberbox** Added support for variable-width fonts.
- **scrollbar** Added Shift+Click to jump scroll directly to the mouse.
- **nineslice** Added typed nineslice styles.
- **styler** Made default icons nicer.
- **breitbandgraphics** Added `draw_image2`.

### ⚡ Performance

- **core** Optimized rich text parsing.
- **core** Optimized scene sorting.
- **core** Optimized event dispatching.
- **core** Optimized UID checks.
- **styler** Optimized rich text rendering.
- **styler** Removed unnecessary text measurement in `draw_list_item`.
- **styler** Changed `draw_carrousel_button` to avoid deep cloning.
- **joystick** Changed to avoid an expensive deep clone in the hot path.
- **ext** Removed nineslice image caching.

### 🐞 Bugfixes

- **ext** Fixed `draw_list_item` passing wrong data to `draw_rich_text`.
- **ext** Fixed `draw_icon` having the wrong path passed into them.
- **textbox** Fixed one frame of unintended rendering delay.

### ⚠️ Breaking changes and migration

#### Environment simplification (breaking)

ugui no longer requires an injected environment. This removes a layer of indirection and simplifies user code.

The following APIs have been removed:

- `ugui.STATIC_ENV`
- `UguiClipboardGetDelegate`
- `UguiClipboardSetDelegate`
- `UguiClipboard`
- `UguiVKeycodes`

Remove the `ugui.STATIC_ENV` setup from user code. Keycodes are now accessed through the global Mupen API, for example:

```lua
-ugui.keycodes.VK_F1
+Mupen.VKeycodes.VK_F1
```

Users running ugui outside a Mupen environment must implement the global API themselves.

#### `carrousel_button.text` clobbering (breaking)

If user code was passing `text` into `carrousel_button` controls, remove it because the control now clobbers that value.

### Type changes (non-runtime-breaking)

ugui has replaced various BreitbandGraphics types with ugui-specific equivalents:

- `Rectangle` -> `UguiRect`
- `Vector2` -> `UguiVector2`
- `Color` -> `UguiRGBA8`
- `ColorSource` -> `UguiColorSource`
- `Alignment` -> `UguiAlignment`, and `BreitbandGraphics.alignment` -> `ugui.alignment`

Replace references to these in your code if you're using them in a direct ugui context.
If you're using the BreitbandGraphics types directly, you don't need to change anything.

This doesn't affect runtime behavior.

### BreitbandGraphics decoupling

ugui no longer requires BreitbandGraphics.

If you were pulling it in only for ugui, but not using it directly, you can remove it from your project:

```diff
-BreitbandGraphics = dofile(folder .. 'breitbandgraphics-amalgamated.lua')
```

#### Other adoption notes

- `combobox` now reserves 5 UID slots instead of 3. Adjust sequential UIDs accordingly if they're hardcoded. Prefer `ugui.registry.combobox.uids()` when allocating IDs.
- `spinner` is now a real control and reserves 4 UID slots. Adjust sequential UIDs accordingly if they're hardcoded. Prefer `ugui.registry.spinner.uids()` when allocating IDs.
- `tabcontrol` is now a real control and reserves one parent UID plus one UID per tab. Adjust sequential UIDs accordingly if they're hardcoded. Prefer `ugui.registry.tabcontrol.uids(control)` when allocating IDs.
- A per-frame `shift` modifier must be provided in the environment passed to `ugui.begin_frame`:

```lua
local mup_input = input.get()
ugui.begin_frame({ ..., shift = mup_input.shift })
```

- `Environment.wheel` is deprecated in favor of `Environment.mouse_events`:

```diff
+local stored_mouse_events = {}

emu.atpaint(function()
    ugui.begin_frame({
-        wheel = stored_wheel,
+        mouse_events = stored_mouse_events,
    })
    ugui.end_frame()
+    stored_mouse_events = {}
end)

+emu.atmouse(function(e)
+    stored_mouse_events[#stored_mouse_events + 1] = e
+end)
```
