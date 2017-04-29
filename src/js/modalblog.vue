<template>
    <div>
        <script type="text/x-template" id="modal-template">
            <transition name="blogbox">
                <div class="blogbox-mask">
                    <div class="blogbox-wrapper">
                        <div class="blogbox-hidden" @click="$emit('close')"></div>
                        <button class="btn btn-default buttonclose" @click="$emit('close')">X</button>
                        <div class="blogbox-container" id="modul-container">
                            <div class="blogbox-header">
                                <slot name="header">
                                </slot>
                            </div>

                            <div class="blogbox-body">
                                <slot name="text">
                                </slot>
                                <hr/>
                                <slot name="images">
                                </slot>
                            </div>
                        </div>

                    </div>
                </div>
            </transition>
        </script>
        <modal v-if="selection" @close="selection = null">
            <h3 slot="header">
                {{selection.title}}
            </h3>
            <p slot="text" align="justify" v-html="selection.message"></p>
            <div slot="images" class="row">
                <div class="col-md-4 blogboximage" v-for="(image, index) in selection.images">
                    <img class="img-rounded" v-bind:src="image" width="100%">
                </div>
            </div>
        </modal>
    </div>
</template>
<script>
    export default {
        data: function() {
            return {
                showblogbox: false,
                selection: null
            }
        },
        methods: {
            appear: function(selection) {
                this.selection = selection;
                this.showblogbox = true;
            }
        }
    }
</script>