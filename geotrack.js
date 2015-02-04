import React from 'React'

export class Geotracker extends React.Component {
	constructor(props){
		super(props)

		//  bind our hadnlers
		this._acceptPosition= this._acceptPosition.bind(this)
		this._errorPosition= this._errorPosition.bind(this)
		this._fetchPosition= this._fetchPosition.bind(this)

		// set-interval based timing controls
		var watch = this.getAttribute("watch")
		if(watch === undefined) watch= props.watch
		if(watch !== undefined) this.watch= watch
		var interval= this.getAttribute("interval") || props.interval
		if(interval) this.interval= interval

		// PositionOpts settings
		// https://developer.mozilla.org/en-US/docs/Web/API/PositionOptions
		var enableHighAccuracy= this.getAttribute("enableHighAccuracy") || props.enableHighAccuracy
		if(enableHighAccuracy) this.enableHighAccuracy= enableHighAccuracy
		var timeout= this.getAttribute("timeout") || props.timeout
		if(timeout) this.timeout= timeout
		var maximumAge= this.getAttribute("maximumAge") || props.maximumAge
		if(maximumAge) this.maximumAge= maximumAge

		// go time?
		var enabled = this.getAttribute("enabled") || props.enabled
		if (enabled === true || enabled === "true")
			this.enabled= true
	}

	attributeChanged(name, oldValue, newValue){
		if (name === "interval") {
			this.interval= newValue
		} else if (name === "enabled") {
			this.enabled  newValue
		} else if (name === "enableHighAccuracy") {
			this.enableHighAccuracy= enewValue
		} else if (name === "timeout") {
			this.timeout= newValue
		} else if (name === "maximumAge") {
			this.maximumAge= newValue
		} else {
			console.warn("unknown attribute: "+name)
		}
	}

	render: function() {
		// got a virtual component for your virtual dom
		return React.DOM.Div({})
	}

	get interval(){
		return this._interval || 200
	}
	set interval(value){
		value= parseInt(value)
		if(Number.isNaN(value)){
			throw "Invalid number"
		}
		if(this.interval == value)
			return
		this._interval= value
		this._setupTimer()
		this.setAttribute("interval", value)
	}
	get watch(){
		return this._watch
	}
	set watch(value){
		if(value == this.watch)
			return
 		if(value === "true" && this.watch)
			return
		value= !!value
		this._watch= value
		this._setupTimer()
		this.setAttribute("watch", value)
	}
	get enabled() {
		return !!this._intervaler || !!this._watcher
		
	}
	set enabled(value) {
		if(this.enabled && !value){
			if(this._intervaller){
				clearInterval(this._intervaller)
				this._intervaller= null	
			}
			if(this._watcher){
				navigator.geolocation.clearWatch(this._watcher)
				this._watcher= null
			}
		}else if(value && !this.enabled){
			if(this.watch){
				this._watcher= navigator.geolocation.watchPosition(this._acceptPosition, this._errorPosition, this.positionOpts)
			}else{
				this._intervaller= setInterval(this._fetchPosition, this.interval*1000)
			}
		}
		this.setAttribute("enabled", !!value)
	}

	get positions() {
		if(!this._positions) this._positions= new ReadableStream({
			start(enqueue, close, error) {
				self._enqueue= enqueue
				self._close= close
				self._error= error
			}
			cancel() {
				self.enable= false
			}
		})
		this.enabled= true
		return this._positions
	}

	get enableHighAccuracy(){
		return this._enableHighAccuracy
	}
	set enableHighAccuracy(value){
		if(value == this.enableHighAccuracy)
			return
		value= !!value
		this._enableHighAccuracy= value
		this._setupTimer()
		this.setAttribute('enableHighAccuracy', value)
		
	}
	get timeout(){
		return this._timeout
	}
	set timeout(value){
		if(value == this._timeout)
			return
		this._timeout= value
		this._setupTimer()
		this.setAttribute('timeout', value)
	}
	get maximumAge(){
		return this._maximumAge
	}
	set maximumAge(value){
		if(value == this._maximumAge)
			return
		this._maximumAge= value
		this._setupTimer()
		this.setAttribute('maximumAge', value)
	}
	get positionOpts(){
		return {
			enableHighAccuracy: this._enableHighAccuracy,
			timeout: this._timeout,
			maximumAge: this._maximumAge
		}
	}

	_setupTimer(){
		if(this.enabled){
			this.enabled= false
			this.enabled= true
		}
	}
	_fetchPosition(){
		navigator.geolocation.getCurrentPosition(this._acceptPosition, this._errorPosition, this.positionOpts)
	}
	_acceptPosition(position){
		if(this._enqueue)
			this._enqueue(position)
	}
	_errorPosition(){
	}
}
