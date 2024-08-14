import React from 'react'

function NotFound() {
  return (
    <div style={{
        paddingTop:"200px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        gap: "10px"
    }}>
        <h1 style={{
            fontSize: "75px"
        }}>404</h1>
        <p style={{
            fontSize: "18px"
        }}>Page not found</p>
        <div>
            <a style={{
                textDecoration: "none",
                fontSize: "16px"
            }} href='/'>Return to home page</a>
        </div>
        
    </div>
  )
}

export default NotFound