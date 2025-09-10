<template>
  <component
    :is="tag"
    :class="ui"
    data-component="z-text"
  >
    <slot />
  </component>
</template>

<script setup lang="ts">
import { computed, useAttrs } from 'vue'

const props = withDefaults(
  defineProps<{
    tag?: string;
    align?: 'left' | 'center' | 'right' | 'justify';
    size?:
      | 'extra-small'
      | 'small'
      | 'medium'
      | 'large'
      | 'extra-large'
      | 'title';
    weight?: 'normal' | 'medium' | 'semi-bold' | 'bold';
    color?:
      | 'inherit'
      | 'primary'
      | 'white'
      | 'success'
      | 'danger'
      | 'warning'
      | 'info'
      | 'gray';
  }>(),
  {
    tag: 'p',
    align: 'left',
    size: 'medium',
    weight: 'normal',
    color: 'inherit'
  }
)

const attrs = useAttrs()

const ui = computed(() => [
  {
    'text-left': props.align === 'left',
    'text-center': props.align === 'center',
    'text-right': props.align === 'right',
    'text-justify': props.align === 'justify',
    'md:text-xs text-2xs': props.size === 'extra-small',
    'md:text-sm text-xs': props.size === 'small',
    'md:text-base text-sm': props.size === 'medium',
    'md:text-lg text-base': props.size === 'large',
    'md:text-2xl text-xl': props.size === 'extra-large',
    'md:text-4xl text-3xl': props.size === 'title',
    'font-normal': props.weight === 'normal',
    'font-medium': props.weight === 'medium',
    'font-semibold': props.weight === 'semi-bold',
    'font-bold': props.weight === 'bold',
    'text-stone dark:text-white': props.color === 'inherit',
    'text-gray-800 dark:text-gray-500': props.color === 'gray',
    'text-primary': props.color === 'primary',
    'text-white': props.color === 'white',
    'text-green-400': props.color === 'success',
    'text-red-400': props.color === 'danger',
    'text-yellow-400': props.color === 'warning',
    'text-blue-400': props.color === 'info'
  },
  attrs.class
])
</script>
