Component({
  data: {},
  properties: {
		tabs: {
			type: Array,
			value: []
		}
	},
  methods: {
		handleItemTabs(e) {
			const { index } = e.currentTarget.dataset;
			this.triggerEvent('itemChange',{ index })
		}
	}
})