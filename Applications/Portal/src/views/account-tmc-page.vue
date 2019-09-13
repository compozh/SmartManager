<template>
  <div class="zzz">
      <!-- IF CART HAVE ITEMS -->
                <div class="vx-row" v-if="cartItems.length">

                    <!-- LEFT COL -->
                    <div class="vx-col lg:w-2/3 w-full relative">
                        <div class="items-list-view" v-for="(item, index) in cartItems" :key="item.objectID">
                            <item-list-view :item="item">

                                <!-- SLOT: ITEM META -->
                                <template slot="item-meta">
                                    <h6 class="item-name font-semibold mb-1">{{ item.name }}</h6>
                                    <p class="text-sm mb-2 cursor-pointer">By <span class="text-primary font-semibold">{{ item.brand }}</span></p>
                                    <p class="text-success text-sm">In Stock</p>

                                    <p class="mt-4 font-bold text-sm">Quantity</p>
                                    <vs-input-number min="1" max="10" :value="item.quantity" @input="updateItemQuantity($event, index)" class="inline-flex" />

                                    <p class="font-medium text-grey mt-4">Delivery by, {{ item.delivery_date }}</p>
                                    <p class="text-success font-medium">{{ item.discount_in_percentage }}% off {{ item.offers_count }} offers Available</p>
                                </template>

                                <!-- SLOT: ACTION BUTTONS -->
                                <template slot="action-buttons">

                                    <!-- PRIMARY BUTTON: REMOVE -->
                                    <div class="item-view-primary-action-btn p-3 rounded-lg flex flex-grow items-center justify-center cursor-pointer mb-3" @click="removeItemFromCart(item)">
                                        <feather-icon icon="XIcon" svgClasses="h-4 w-4" />
                                        <span class="text-sm font-semibold ml-2">REMOVE</span>
                                    </div>

                                    <!-- SECONDARY BUTTON: MOVE-TO/VIEW-IN WISHLIST -->
                                    <div class="item-view-secondary-action-btn bg-primary p-3 rounded-lg flex flex-grow items-center justify-center text-white cursor-pointer" @click="wishListButtonClicked(item)">
                                        <feather-icon icon="HeartIcon" :svgClasses="[{'text-white fill-current': isInWishList(item.objectID)}, 'h-4 w-4']" />
                                        <span class="text-sm font-semibold ml-2" v-if="isInWishList(item.objectID)">WISHLIST</span>
                                        <span class="text-sm font-semibold ml-2" v-else>WISHLIST</span>
                                    </div>
                                </template>
                            </item-list-view>
                        </div>
                    </div>

                    <!-- RIGHT COL -->
                    <div class="vx-col lg:w-1/3 w-full">
                        <vx-card>
                            <p class="text-grey mb-3">Options</p>
                            <div class="flex justify-between">
                                <span class="font-semibold">Coupons</span>
                                <span class="font-medium text-primary cursor-pointer">Apply</span>
                            </div>

                            <vs-divider />

                            <p class="font-semibold mb-3">Price Details</p>
                            <div class="flex justify-between mb-2">
                                <span class="text-grey">Total MRP</span>
                                <span>$598</span>
                            </div>
                            <div class="flex justify-between mb-2">
                                <span class="text-grey">Bag Discount</span>
                                <span class="text-success">-25$</span>
                            </div>
                            <div class="flex justify-between mb-2">
                                <span class="text-grey">Estimated Tax</span>
                                <span>$1.3</span>
                            </div>
                            <div class="flex justify-between mb-2">
                                <span class="text-grey">EMI Eligibility</span>
                                <a href="#" class="text-primary">Details</a>
                            </div>
                            <div class="flex justify-between mb-2">
                                <span class="text-grey">Delivery Charges</span>
                                <span class="text-success">Free</span>
                            </div>

                            <vs-divider />

                            <div class="flex justify-between font-semibold mb-3">
                                <span>Total</span>
                                <span>$574.3</span>
                            </div>

                            <vs-button class="w-full" @click="$refs.checkoutWizard.nextTab()">PLACE ORDER</vs-button>
                        </vx-card>
                    </div>
                </div>

                <!-- IF NO ITEMS IN CART -->
                <vx-card title="You don't have any items in your cart." v-else>
                    <vs-button @click="$router.push('/apps/eCommerce/shop')">Browse Shop</vs-button>
                </vx-card>

  </div>
</template>

<script>
const ItemListView = () => import('./components/ItemListView.vue')

export default {
  data() {
    return {

      // TAB 2
      fullName: '',
      mobileNum: '',
      pincode: '',
      houseNum: '',
      area: '',
      landmark: '',
      city: '',
      state: '',
      addressType: 1,
      addressTypeOptions: [
        { text: 'Home', value: 1 },
        { text: 'Office', value: 2 },
      ],

      // TAB 3
      paymentMethod: 'debit-card',
      cvv: '',
    }
  },
  components: {
    ItemListView,
  },
  computed: {
    cartItems() {
      return this.$store.state.eCommerce.cartItems.slice().reverse()
    },
    isInWishList() {
      return (itemId) => this.$store.getters['eCommerce/isInWishList'](itemId)
    },
  },
}
</script>

<style>

</style>
