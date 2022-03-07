<template>
    <button @click="ru(); count++">
        Count is: {{ count }}
    </button>
</template>

<script>
export default {
    name : "Login",
    data() {
        return {
            count : 0
        }
    },
    methods: {
        ru() {
            console.log(process.env);
            alert("Hello from vue.js ");
        }
    }
}
</script>

<style scoped>

</style>