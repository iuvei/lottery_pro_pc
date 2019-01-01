import Vue from 'vue'
import {
  Button,
  Table,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  DatePicker,
  Select,
  Option,
  Input,
  Badge,
  Page,
  Switch,
  Checkbox,
  Message,
  Modal,
  FormItem,
  Slider,
  Tooltip,
  Carousel,
  CarouselItem,
  CheckboxGroup,
  Icon,
  InputNumber
} from 'iview'

Vue.component('Button', Button)
Vue.component('Table', Table)
Vue.component('Dropdown', Dropdown)
Vue.component('DropdownMenu', DropdownMenu)
Vue.component('DropdownItem', DropdownItem)
Vue.component('DatePicker', DatePicker)
Vue.component('Select', Select)
Vue.component('Option', Option)
Vue.component('Input', Input)
Vue.component('Badge', Badge)
Vue.component('Page', Page)
Vue.component('FormItem', FormItem)
Vue.component('Checkbox', Checkbox)
Vue.component('Modal', Modal)
Vue.component('Slider', Slider)
Vue.component('ISwitch', Switch)
Vue.component('Tooltip', Tooltip)
Vue.component('Carousel', Carousel)
Vue.component('CarouselItem', CarouselItem)
Vue.component('CheckboxGroup', CheckboxGroup)
Vue.component('InputNumber', InputNumber)
Vue.component('Icon', Icon)

Vue.prototype.$Message = Message
Message.config({
    top: 350,
    duration: 3
});