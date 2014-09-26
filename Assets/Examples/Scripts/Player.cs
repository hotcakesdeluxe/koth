using UnityEngine;
using System;
using System.Collections;
using System.Collections.Generic;
using HappyFunTimes;
using CSSParse;

class Player : MonoBehaviour
{
	private Color m_color;
	private NetPlayer m_netPlayer;
	public Material clothes;

	[CmdName("move")]
	private class MessageMove : MessageCmdData {
		public float x = 0;
		public float y = 0;
	};
	[CmdName("jump")]
	private class MessageJump : MessageCmdData {
		public bool pressed = false;
	};
	[CmdName("turn")]
	private class MessageTurn : MessageCmdData {

	};
	[CmdName("color")]
	private class MessageColor : MessageCmdData {
		public string color = "";    // in CSS format rgb(r,g,b)
	};

	void Start() {
		m_color = new Color(0.0f, 1.0f, 0.0f);
	}
	
	void InitializeNetPlayer(SpawnInfo spawnInfo) {
		m_netPlayer = spawnInfo.netPlayer;

		m_netPlayer.RegisterCmdHandler<MessageMove>(OnMove);
		m_netPlayer.RegisterCmdHandler<MessageJump>(OnJump);
		m_netPlayer.RegisterCmdHandler<MessageTurn>(OnTurn);
		m_netPlayer.RegisterCmdHandler<MessageColor>(OnColor);
		m_netPlayer.OnDisconnect += Remove;
	}
	
	// delete this gameobject if the player disconnects
	private void Remove(object sender, EventArgs e) {
		Destroy(gameObject);
	}

	private void OnMove(MessageMove data) {
		print ("yoooo");
	}
	private void OnJump(MessageJump data) {
		print (data.pressed);
		if (data.pressed == true) {
						print ("yoooo");
				}
		if (data.pressed == false) {
			print ("noooo");
		}
	}
	private void OnTurn(MessageTurn data) {
		print ("turnt");
	}
	private void OnColor(MessageColor data) {
		m_color = CSSParse.Style.ParseCSSColor(data.color);
		clothes.color = m_color;
		print (m_color);
	}

}