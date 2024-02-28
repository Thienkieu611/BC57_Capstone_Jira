import React from 'react'
import { Outlet } from 'react-router-dom'

const LoginTemplate = () => {
  return (
    <div>
        <div className="row">
            <div className="col-6">
                <img src="https://st4.depositphotos.com/16959514/27403/v/450/depositphotos_274031174-stock-illustration-kanban-board-teamwork-briefing-scheme.jpg" alt="..." className='img-fluid w-100'/>
            </div>
            <div className="col-6">
                <Outlet/>
            </div>
        </div>
    </div>
  )
}

export default LoginTemplate