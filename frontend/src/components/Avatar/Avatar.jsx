import React, { forwardRef } from 'react';
import styles from "./Avatar.module.css"

const Avatar = forwardRef(({ hasBorder = true, src, onClick, isClickable = false}, ref) => { 
  return(
    <img
      ref={ref} 
      className={`${hasBorder ? styles.avatarWithBorder : styles.avatar} ${isClickable ? styles.clickable : ''}`}
      src={src} 
      alt="Foto de Perfil" 
      onClick={onClick}/>
  )
})

export { Avatar}