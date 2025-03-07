<template>
  <ValidationObserver v-slot="{ handleSubmit }">
    <form
      id="shipping-details-form"
      class="form"
      @submit.prevent="handleSubmit(submitForm)"
    >
      <div class="form__horizontal">
        <ValidationProvider
          rules="required|min:2"
          v-slot="{ errors }"
          class="form__element"
        >
          <SfInput
            v-model="form.firstName"
            name="firstName"
            label="First Name"
            required
            :valid="!errors[0]"
            :errorMessage="errors[0]"
          />
        </ValidationProvider>
        <ValidationProvider
          rules="required|min:2"
          v-slot="{ errors }"
          class="form__element"
        >
          <SfInput
            v-model="form.lastName"
            name="lastName"
            label="Last Name"
            required
            :valid="!errors[0]"
            :errorMessage="errors[0]"
          />
        </ValidationProvider>
      </div>
      <ValidationProvider
        rules="required|min:5"
        v-slot="{ errors }"
        class="form__element"
      >
        <SfInput
          v-model="form.streetName"
          name="streetName"
          label="Street Name"
          required
          :valid="!errors[0]"
          :errorMessage="errors[0]"
        />
      </ValidationProvider>
      <SfInput
        v-model="form.apartment"
        name="apartment"
        label="House/Apartment number"
        class="form__element"
      />
      <div class="form__horizontal">
        <ValidationProvider
          rules="required|min:2"
          v-slot="{ errors }"
          class="form__element"
        >
          <SfInput
            v-model="form.city"
            name="city"
            label="City"
            required
            :valid="!errors[0]"
            :errorMessage="errors[0]"
          />
        </ValidationProvider>
        <ValidationProvider
          name="state"
          :rules="!statesInSelectedCountry ? null : 'required|min:2'"
          v-slot="{ errors }"
          slim
        >
          <SfSelect
            v-model="form.state"
            label="State/Province"
            name="state"
            class="form__element form__element--half form__element--half-even form__select sf-select--underlined"
            required
            :valid="!errors[0]"
            :errorMessage="errors[0]"
            :disabled="!statesInSelectedCountry"
          >
            <SfSelectOption
              v-for="state in statesInSelectedCountry"
              :key="state"
              :value="state"
            >
              {{ state }}
            </SfSelectOption>
          </SfSelect>
        </ValidationProvider>
      </div>
      <div class="form__horizontal">
        <ValidationProvider
          rules="required|min:4"
          v-slot="{ errors }"
          class="form__element"
        >
          <SfInput
            v-model="form.postalCode"
            name="zipCode"
            label="Zip-code"
            required
            :valid="!errors[0]"
            :errorMessage="errors[0]"
          />
        </ValidationProvider>
        <ValidationProvider
          :rules="`required|oneOf:${countries.map(c => c.name).join(',')}`"
          v-slot="{ errors }"
          class="form__element"
        >
          <SfSelect
            class="form__select sf-select--underlined"
            v-model="form.country"
            name="country"
            label="Country"
            required
            :valid="!errors[0]"
            :errorMessage="errors[0]"
          >
            <SfSelectOption
              v-for="{ name, label } in countries"
              :key="name"
              :value="name"
            >
              {{ label }}
            </SfSelectOption>
          </SfSelect>
        </ValidationProvider>
      </div>
      <ValidationProvider
        rules="required|min:8"
        v-slot="{ errors }"
        class="form__element"
      >
        <SfInput
          v-model="form.phone"
          name="phone"
          label="Phone number"
          required
          :valid="!errors[0]"
          :errorMessage="errors[0]"
        />
      </ValidationProvider>
      <SfCheckbox
        v-model="form.isDefault"
        name="isDefault"
        label="Set as default"
        class="form__checkbox-isDefault"
      />
      <SfButton class="form__button">
        {{ isNew ? "Add the address" : "Update the address" }}
      </SfButton>
    </form>
  </ValidationObserver>
</template>

<script>
import {
  SfInput,
  SfButton,
  SfSelect,
  SfCheckbox
} from '@storefront-ui/vue';
import { required, min, oneOf } from 'vee-validate/dist/rules';
import { ValidationProvider, ValidationObserver, extend } from 'vee-validate';
import { reactive, computed, watch } from '@nuxtjs/composition-api';
import { useVSFContext } from '@vue-storefront/core';
import { userShippingGetters } from '@vue-storefront/kibocommerce';

extend('required', {
  ...required,
  message: 'This field is required'
});

extend('min', {
  ...min,
  message: 'The field should have at least {length} characters'
});

extend('oneOf', {
  ...oneOf,
  message: 'Invalid country'
});

export default {
  name: 'ShippingAddressForm',

  components: {
    SfInput,
    SfButton,
    SfSelect,
    SfCheckbox,
    ValidationProvider,
    ValidationObserver
  },

  props: {
    address: {
      type: Object,
      default: () => ({
        id: undefined,
        firstName: '',
        lastNameOrSurname: '',
        address: {
          address1: '',
          address2: '',
          cityOrTown: '',
          stateOrProvince: '',
          postalOrZipCode: '',
          countryCode: ''
        },
        phoneNumbers: {
          home: ''
        },
        types: [{
          name: 'Shipping',
          isPrimary: false
        }]
      })
    },
    isNew: {
      type: Boolean,
      required: true
    }
  },

  setup(props, { emit }) {
    const { $kibo: { config } } = useVSFContext();
    const form = reactive({
      id: userShippingGetters.getId(props.address),
      firstName: userShippingGetters.getFirstName(props.address),
      lastName: userShippingGetters.getLastName(props.address),
      streetName: userShippingGetters.getStreetName(props.address),
      apartment: userShippingGetters.getApartmentNumber(props.address),
      city: userShippingGetters.getCity(props.address),
      state: userShippingGetters.getProvince(props.address),
      postalCode: userShippingGetters.getPostCode(props.address),
      country: userShippingGetters.getCountry(props.address),
      phone: userShippingGetters.getPhone(props.address),
      isDefault: userShippingGetters.isDefault(props.address)
    });

    const submitForm = () => {
      emit('submit', {
        form,
        onComplete: () => {},
        // TODO: Handle Error
        onError: () => {}
      });
    };

    const statesInSelectedCountry = computed(() => {
      if (!form.country) {
        return null;
      }
      const selectedCountry = config.countries.find(country => country.name === form.country);
      return selectedCountry && selectedCountry.states;
    });

    watch(statesInSelectedCountry, statesInSelectedCountry => {
      const countryHasStates = statesInSelectedCountry && statesInSelectedCountry.length;
      if (!countryHasStates && form.state) {
        form.state = null;
      }
    });

    return {
      form,
      submitForm,
      countries: config.countries,
      statesInSelectedCountry
    };
  }
};
</script>

<style lang='scss' scoped>
.form {
  &__element {
    display: block;
    margin-bottom: var(--spacer-base);
  }
  &__select {
    display: flex;
    align-items: center;
    --select-option-font-size: var(--font-size--lg);
    flex-wrap: wrap;
    ::v-deep .sf-select__dropdown {
      font-size: var(--font-size--lg);
      // margin: 0;
      font-family: var(--font-family--secondary);
      font-weight: var(--font-weight--normal);
    }
  }
  &__button {
    display: block;
    margin-top: var(--spacer-lg);
  }
  &__horizontal {
    @include for-desktop {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
    }
    .form__element {
      @include for-desktop {
        flex: 1;
        margin-right: var(--spacer-lg);
      }
      &:last-child {
        margin-right: 0;
      }
    }
  }
}
</style>
