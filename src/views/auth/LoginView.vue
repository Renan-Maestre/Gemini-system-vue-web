<script setup lang="ts">
import LoginForm from "@/components/auth/LoginForm.vue"
import ModeToggle from "@/components/ModeToggle.vue";

</script>

<template>
  <div class="absolute top-4 right-4 z-50">

      <ModeToggle />

  </div>
  <div class="bg-muted flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
    <div class="w-full max-w-sm md:max-w-4xl">
      <LoginForm />
    </div>
  </div>
</template>
