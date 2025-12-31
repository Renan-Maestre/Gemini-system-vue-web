<script lang="ts">
export const iframeHeight = "800px"
export const description = "A dashboard with sidebar, data table, and analytics cards."
</script>

<script setup lang="ts">

import ChartAreaInteractive from "@/components/dashboard/ChartAreaInteractive.vue"
import SectionCards from "@/components/dashboard/SectionCards.vue"



</script>

<template>
        <div class="@container/main flex flex-1 flex-col gap-2">
          <div class="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            <SectionCards />
            <div class="px-4 lg:px-6">
              <ChartAreaInteractive />
            </div>

          </div>
        </div>
</template>
