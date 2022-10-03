<template>
  <footer class="sidebar__footer">
    <div>
      <slot name="start" />
    </div>
    <div>
      <slot name="end" />
    </div>
  </footer>
</template>

<style>
.sidebar__footer {
  margin-top: auto;
  display: flex;
  justify-content: space-between;
}
</style>
