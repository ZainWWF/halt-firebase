import React, { Dispatch, SetStateAction } from 'react';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import * as firebase from 'firebase/app';

type Props = {
	anchorEl :  HTMLElement | null
	onCloseAvatarMenu: ()=>void
	setOpenAssistance: Dispatch<SetStateAction<boolean>>
}

export default function SimpleMenu(props: Props) {


	const {anchorEl, onCloseAvatarMenu, setOpenAssistance } = props
	
	
	const onClickSignOut = () => {
		firebase.auth().signOut().then(async () => {
			onCloseAvatarMenu()
			window.location.assign("/");
		}).catch(function (error) {
			// An error happened.
		});
	}

	const onClickRequestAssistance=()=>{
		setOpenAssistance(true)
		onCloseAvatarMenu()
	}
	
	return (
    <div>
      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={onCloseAvatarMenu}
      >
        <MenuItem onClick={onCloseAvatarMenu}>Account Details</MenuItem>
        <MenuItem onClick={onClickRequestAssistance}>Request Assistance</MenuItem>
        <MenuItem onClick={onClickSignOut}>Sign Out</MenuItem>
      </Menu>
    </div>
  );
}