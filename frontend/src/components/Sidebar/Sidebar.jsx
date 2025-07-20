import { useState, useRef} from 'react'
import { Avatar } from '../Avatar/Avatar';
import styles from './Sidebar.module.css'

import { useAuth } from '../../hooks/auth';

import avatarPlaceholder from '../../assets/profileNull.jpg'
import bannerPlaceholder from '../../assets/bannerNull.jpg'

import { api } from '../../services/api'

export function Sidebar() {
  const { user, updateProfile } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [name, setName] = useState(user.name)
  const [role, setRole] = useState(user.role)

  const avatarUrl = user.avatar ? `${api.defaults.baseURL}/files/avatars/${user.avatar}` : avatarPlaceholder
  const [avatar, setAvatar] = useState(avatarUrl)
  const [avatarFile, setAvatarFile] = useState(null)
  const avatarInputRef = useRef(null)
  
  const bannerUrl = user.banner ? `${api.defaults.baseURL}/files/banners/${user.banner}` : bannerPlaceholder
  const [banner, setBanner] = useState(bannerUrl)
  const [bannerFile, setBannerFile] = useState(null)
  const bannerInputRef = useRef(null)



  const toggleEditMode = () => {
    setIsEditing(!isEditing)
  }

  const handleCancel = () => {
    setIsEditing(false);
    setName(user.name);
    setRole(user.role);
    setAvatar(avatarUrl)
    setBanner(bannerUrl)
  };

  const handleBannerClick = () => {
    if(bannerInputRef.current){
      bannerInputRef.current.click()
    }
  }

  const handleAvatarClick = () => {
    if(avatarInputRef.current){
      avatarInputRef.current.click()
    }
  }

  const handleChangeBanner = (e) => {
    const file = e.target.files[0];
    if (file) {
      setBannerFile(file)      
      const imagePreview = URL.createObjectURL(file)
      setBanner(imagePreview)
      setIsEditing(true)
    }
  };

  const handleChangeAvatar = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file)

      const imagePreview = URL.createObjectURL(file)
      setAvatar(imagePreview)
      setIsEditing(true)
      
    }
  };

  async function handleUpdate() {
    if(!name.trim() || !role.trim()){
      alert("Nome e cargo são obrigatórios")
      return
    }

    const userData = {
      name,
      role,
    }
    
    try {
      await updateProfile({ user: userData, avatarFile, bannerFile });
      setIsEditing(false);
      window.location.reload(); // Só recarrega depois que o updateProfile é concluído
    } catch (error) {
      console.error("Erro ao atualizar o perfil:", error);
      alert("Ocorreu um erro ao atualizar o perfil.");
    }
      
  };

  return (
    <aside className={styles.sidebar}>
      <img
        className={styles.cover} 
        src={banner}
        onClick={handleBannerClick}
      />

      <div className={styles.profile}>
        <Avatar 
          src={avatar}
          onClick={handleAvatarClick}
          isClickable={true}
        />

        {isEditing ? (
          <>
            <input 
              type="text" 
              value={name} 
              onChange={(e) => setName(e.target.value)}
              className={styles.editInput}
              maxLength={40}
            />
            <input 
              type="text" 
              value={role} 
              onChange={(e) => setRole(e.target.value)}
              className={styles.editInput}
              maxLength={12}
            />
          </>
        ) : (
          <>
            <strong>{name}</strong>
            <span>{role}</span>
          </>
        )}
      </div>

      <footer>
        {isEditing ? (
          <div className={styles.editButtonsContainer}>
            <button className={styles.editButton} onClick={handleUpdate}>Salvar</button>
            <button className={styles.editButton} onClick={handleCancel}>Cancelar</button>
          </div>
        ) : (
          <a href="#" onClick={toggleEditMode}>Editar seu perfil</a>
        )}
      </footer>

      <input
        type="file"
        ref={bannerInputRef}
        style={{ display: 'none' }}
        accept="image/*"
        onChange={handleChangeBanner}
      />
      
      <input
        type="file"
        ref={avatarInputRef}
        style={{ display: 'none' }}
        accept="image/*"
        onChange={handleChangeAvatar}
      />
    </aside>
  );
}