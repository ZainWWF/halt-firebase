import React from 'react';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import * as firebase from 'firebase/app';

type Props = {
	anchorEl :  HTMLElement | null
	onCloseAvatarMenu: ()=>void
}

export default function SimpleMenu(props: Props) {


	const {anchorEl, onCloseAvatarMenu } = props
	
	
	const logout = () => {
		firebase.auth().signOut().then(async () => {
			onCloseAvatarMenu()
			window.location.assign("/");
		}).catch(function (error) {
			// An error happened.
		});

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
        <MenuItem onClick={onCloseAvatarMenu}>Request Assistance</MenuItem>
        <MenuItem onClick={logout}>Sign Out</MenuItem>
      </Menu>
    </div>
  );
}