export default {
    props: ['tempProduct', 'addCart'],
    data() {
        return {
            productModal: null,
            isModal: false,
            qty:1,
            
        }
    },
    methods: {
        open() {
            this.productModal.show();
            this.isModal = true;
        },
        hide() {
            this.productModal.hide();
            this.isModal = false;
            
        }
    },
    template: '#userProductModal',
    mounted() {
        this.productModal = new bootstrap.Modal(this.$refs.modal, {
            keyboard: false,
            backdrop: 'static',
        });

    },
    watch:{
        isModal(item){
            if(!item){
                this.qty = 1;
            }
        },
    }
  
}