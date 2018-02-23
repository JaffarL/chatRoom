import React from 'react'
// import logoImg from './1.png'
import './logo.css'
class Logo extends React.Component{

	render(){
		return (
			<div className="logo-container">
				<img src={require('./job.png')} alt=""/>
			</div>
		)
	}
}

export default Logo
