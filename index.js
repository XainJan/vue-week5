import userModal from './userModal.js'
const apiUrl = 'https://ec-course-api.hexschool.io';
const apiPath = 'xain'
Object.keys(VeeValidateRules).forEach(rule => {
    if (rule !== 'default') {
        VeeValidate.defineRule(rule, VeeValidateRules[rule]);
    }
});

// 讀取外部的資源
VeeValidateI18n.loadLocaleFromURL('./zh_TW.json');

// Activate the locale
VeeValidate.configure({
  generateMessage: VeeValidateI18n.localize('zh_TW'),
  validateOnInput: true, // 調整為：輸入文字時，就立即進行驗證
});

const app = Vue.createApp({
    data() {
        return {
            products: [],
            tempProduct: {},
            addCartLoading: '',
            cartQtyLoading: '',
            carts: {},
            isRemove: false,
            isLoading: true,
            user:{
                email:'',
            }
        };
    },
    methods: {
        getproducts() {
            axios.get(`${apiUrl}/v2/api/${apiPath}/products`)
                .then(res => {

                    const { products } = res.data;
                    this.products = products;

                })
                .catch(err => {

                })
                .finally(() => {
                    this.isLoading = false;
                })
        },
        getCart() {
            axios.get(`${apiUrl}/v2/api/${apiPath}/cart`)
                .then(res => {
                    this.carts = res.data.data;

                })
                .catch(err => {
                    (err.data.message)
                })
                .finally(() => {
                    this.isLoading = false;
                })
        },
        addCart(product_id, qty = 1) {
            const order = {
                product_id,
                qty,
            };
            this.addCartLoading = product_id;
            console.log(order)
            axios.post(`${apiUrl}/v2/api/${apiPath}/cart`, { data: order })
                .then(res => {
                    this.addCartLoading = '';
                    this.$refs.userModal.hide();
                    alert(res.data.message);
                    this.isLoading = true;
                    this.getCart();
                })
                .catch(err => {
                    alert(res.data.message)
                })
        },
        changeCartQty(item, qty = 1) {
            const order = {
                product_id: item.product.id,
                qty,
            };
            this.cartQtyLoading = item.id

            axios.put(`${apiUrl}/v2/api/${apiPath}/cart/${item.id}`, { data: order })
                .then(res => {
                    this.cartQtyLoading = '';

                    this.getCart();
                })
                .catch(err => {
                    alert(res.data.message)
                })
        },
        removeCart(id) {
            this.cartQtyLoading = id
            axios.delete(`${apiUrl}/v2/api/${apiPath}/cart/${id}`)
                .then(res => {
                    this.cartQtyLoading = '';

                    this.getCart();
                })
                .catch(err => {
                    alert(err.data.message)
                })
        },
        removeCartAll(item) {
            this.isRemove = true;
            axios.delete(`${apiUrl}/v2/api/${apiPath}/carts`)
                .then(res => {
                    alert(res.data.message)
                    this.isLoading = true;
                    this.getCart();

                })
                .catch(err => {
                    alert(err.data.message)
                })
                .finally(() => {
                    this.isRemove = false
                })
        },
        openModal(tempProduct) {
            this.tempProduct = tempProduct;
            this.$refs.userModal.open();

        },
        onSubmit(){
            console.log(this)
        },
        isPhone(value) {
            const phoneNumber = /^(09)[0-9]{8}$/
            return phoneNumber.test(value) ? true : '需要正確的電話號碼'
          }
    },
    components: {
        userModal,

    },
    mounted() {
        this.getproducts();
        this.getCart();
    },

});
app.component('loading', VueLoading.Component);
app.component('VForm', VeeValidate.Form);
app.component('VField', VeeValidate.Field);
app.component('ErrorMessage', VeeValidate.ErrorMessage);
app.mount('#app');