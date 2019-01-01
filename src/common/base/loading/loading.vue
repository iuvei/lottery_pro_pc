<template>
    <div class="loading-wrapper" v-show="display">
        <svg fill="#a0a7b7" viewBox="0 0 64 64" style="width: 40px; height: 40px"><g stroke-width="0"><circle cx="24" cy="0" transform="translate(32,32)" r="6.90675"><animate attributeName="r" dur="750ms" values="8;7;6;5;4;3;2;1;8" repeatCount="indefinite"></animate></circle><circle cx="16.970562748477143" cy="16.97056274847714" transform="translate(32,32)" r="7.90675"><animate attributeName="r" dur="750ms" values="1;8;7;6;5;4;3;2;1" repeatCount="indefinite"></animate></circle><circle cx="1.4695761589768238e-15" cy="24" transform="translate(32,32)" r="1.65274"><animate attributeName="r" dur="750ms" values="2;1;8;7;6;5;4;3;2" repeatCount="indefinite"></animate></circle><circle cx="-16.97056274847714" cy="16.970562748477143" transform="translate(32,32)" r="1.90675"><animate attributeName="r" dur="750ms" values="3;2;1;8;7;6;5;4;3" repeatCount="indefinite"></animate></circle><circle cx="-24" cy="2.9391523179536475e-15" transform="translate(32,32)" r="2.90675"><animate attributeName="r" dur="750ms" values="4;3;2;1;8;7;6;5;4" repeatCount="indefinite"></animate></circle><circle cx="-16.970562748477143" cy="-16.97056274847714" transform="translate(32,32)" r="3.90675"><animate attributeName="r" dur="750ms" values="5;4;3;2;1;8;7;6;5" repeatCount="indefinite"></animate></circle><circle cx="-4.408728476930472e-15" cy="-24" transform="translate(32,32)" r="4.90675"><animate attributeName="r" dur="750ms" values="6;5;4;3;2;1;8;7;6" repeatCount="indefinite"></animate></circle><circle cx="16.970562748477136" cy="-16.970562748477143" transform="translate(32,32)" r="5.90675"><animate attributeName="r" dur="750ms" values="7;6;5;4;3;2;1;8;7" repeatCount="indefinite"></animate></circle></g></svg>
    </div>
</template>

<script>
    export default {
        name: "loading",
        props: {
            display: {
                type: Boolean,
                default: false
            }
        }
    }
</script>

<style scoped lang="scss">
    .loading-wrapper {
        position: fixed;
        top: 25%;
        left: 50%;
        transform: translate(-50%, -30%);
        z-index: 9999999;
    }
</style>