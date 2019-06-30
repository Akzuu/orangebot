module.exports = {
  WARMUP:
    'script ScriptPrintMessageChatAll(" \x10Ready to play? Start a \x06map veto\x10 with \x06!start\x10 or start a \x06live\x10 match in current map with \x06!ready\x10.");script ScriptPrintMessageChatAll(" \x0eYou can restart a veto if you fuck up, but you can\'t reset a match without an !admin. \x10You can also use \x06!team\x10 to set your clantag! For example, !team AKL. \x06DO NOT CHANGE YOUR TEAM NAME IN THE MIDDLE OF THE GAME!\x10")',
  WARMUP_KNIFE: "say \x10Knife round will start when both teams are \x06!ready\x10",
  KNIFE_DISABLED: 'script ScriptPrintMessageChatAll(" \x10Cancelled knife round.")',
  KNIFE_STARTING:
    'mp_unpause_match;mp_warmup_pausetimer 0;mp_warmuptime 6;mp_warmup_start;mp_maxmoney 0;mp_t_default_secondary "";mp_ct_default_secondary "";mp_free_armor 1;mp_give_player_c4 0;log on;tv_stoprecord;tv_record "{0}";script ScriptPrintMessageChatAll(" \x10Both teams are \x06!ready\x10, starting knife round in:");script ScriptPrintMessageChatAll(" \x085...")',
  KNIFE_STARTED: 'script ScriptPrintMessageChatAll(" \x10Knife round started! GL HF!")',
  KNIFE_WON:
    'mp_pause_match;mp_maxmoney 16000;mp_t_default_secondary "weapon_glock";mp_ct_default_secondary "weapon_hkp2000";mp_free_armor 0;mp_give_player_c4 1;script ScriptPrintMessageChatAll(" \x06{0} \x10won the knife round!");script ScriptPrintMessageChatAll(" \x10Do you want to \x06!stay\x10 or \x06!swap\x10?")',
  KNIFE_STAY: 'mp_unpause_match;mp_restartgame 1;script ScriptPrintMessageChatAll(" \x10Match started! GL HF!")',
  KNIFE_SWAP: 'mp_unpause_match;mp_swapteams;script ScriptPrintMessageChatAll(" \x10Match started! GL HF!")',
  PAUSE_ENABLED: 'mp_pause_match;script ScriptPrintMessageChatAll(" \x10Pausing match on freeze time!")',
  MATCH_STARTING:
    'mp_maxmoney 16000;mp_unpause_match;mp_warmup_pausetimer 0;mp_warmuptime 6;mp_warmup_start;log on;tv_stoprecord;tv_record "{0}";script ScriptPrintMessageChatAll(" \x10Both teams are \x06!ready\x10, starting match in:");script ScriptPrintMessageChatAll(" \x085...")',
  MATCH_STARTED: 'script ScriptPrintMessageChatAll(" \x10Match started! GL HF!")',
  MATCH_PAUSED:
    'mp_respawn_on_death_t 1;mp_respawn_on_death_ct 1;script ScriptPrintMessageChatAll(" \x10Match will resume when both teams are \x06!ready\x10.")',
  MATCH_UNPAUSE:
    'mp_respawn_on_death_t 0;mp_respawn_on_death_ct 0;mp_unpause_match;script ScriptPrintMessageChatAll(" \x10Both teams are \x06!ready\x10, resuming match!")',
  ROUND_STARTED: "mp_respawn_on_death_t 0;mp_respawn_on_death_ct 0",
  READY: 'script ScriptPrintMessageChatAll(" \x10{0} are \x06!ready\x10, waiting for {1}.")',
  LIVE:
    'script ScriptPrintMessageChatAll(" \x03LIVE!");script ScriptPrintMessageChatAll(" \x0eLIVE!");script ScriptPrintMessageChatAll(" \x02LIVE!")',
  VETO: " \x10Starting map veto. All picks are final! {0}, \x06!ban\x10 the first map. (\x06{1}\x10)",
  T: "Terrorists",
  CT: "Counter-Terrorists",
  CONFIG:
    'game_type 0;game_mode 1;ammo_grenade_limit_default 1;ammo_grenade_limit_flashbang 2;ammo_grenade_limit_total 4;bot_quota 0;cash_player_bomb_defused 300;cash_player_bomb_planted 300;cash_player_damage_hostage -30;cash_player_interact_with_hostage 150;cash_player_killed_enemy_default 300;cash_player_killed_enemy_factor 1;cash_player_killed_hostage -1000;cash_player_killed_teammate -300;cash_player_rescued_hostage 1000;cash_team_elimination_bomb_map 3250;cash_team_hostage_alive 150;cash_team_hostage_interaction 150;cash_team_loser_bonus 1400;cash_team_loser_bonus_consecutive_rounds 500;cash_team_planted_bomb_but_defused 800;cash_team_rescued_hostage 750;cash_team_terrorist_win_bomb 3500;cash_team_win_by_defusing_bomb 3500;cash_team_win_by_hostage_rescue 3500;cash_player_get_killed 0;cash_player_respawn_amount 0;cash_team_elimination_hostage_map_ct 2000;cash_team_elimination_hostage_map_t 1000;cash_team_win_by_time_running_out_bomb 3250;cash_team_win_by_time_running_out_hostage 3250;ff_damage_reduction_grenade 0.85;ff_damage_reduction_bullets 0.33;ff_damage_reduction_other 0.4;ff_damage_reduction_grenade_self 1;mp_afterroundmoney 0;mp_autokick 0;mp_autoteambalance 0;mp_buytime 15;mp_c4timer 40;mp_death_drop_defuser 1;mp_death_drop_grenade 2;mp_death_drop_gun 1;mp_defuser_allocation 0;mp_do_warmup_period 1;mp_forcecamera 1;mp_force_pick_time 160;mp_free_armor 0;mp_freezetime 12;mp_friendlyfire 1;mp_halftime 1;mp_halftime_duration 15;mp_join_grace_time 30;mp_limitteams 0;mp_logdetail 3;mp_match_can_clinch 1;mp_match_end_changelevel 1;mp_match_end_restart 0;mp_match_restart_delay 120;mp_maxmoney 65535;mp_maxrounds 30;mp_molotovusedelay 0;mp_overtime_enable 1;mp_overtime_maxrounds 6;mp_overtime_startmoney 10000;mp_playercashawards 1;mp_playerid 0;mp_playerid_delay 0.5;mp_playerid_hold 0.25;mp_round_restart_delay 5;mp_roundtime 1.92;mp_roundtime_defuse 1.92;mp_solid_teammates 1;mp_startmoney 800;mp_teamcashawards 1;mp_teammatchstat_holdtime 0;mp_teammatchstat_txt "";mp_timelimit 0;mp_tkpunish 0;mp_weapons_allow_map_placed 1;mp_weapons_allow_zeus 1;mp_win_panel_display_time 15;spec_freeze_time 2.0;spec_freeze_panel_extended_time 0;spec_freeze_time_lock 2;spec_freeze_deathanim_time 0;sv_accelerate 5.5;sv_stopspeed 80;sv_allow_votes 0;sv_allow_wait_command 0;sv_alltalk 0;sv_alternateticks 0;sv_auto_full_alltalk_during_warmup_half_end 0;sv_cheats 0;sv_clockcorrection_msecs 15;sv_consistency 0;sv_contact 0;sv_damage_print_enable 0;sv_dc_friends_reqd 0;sv_deadtalk 0;sv_forcepreload 0;sv_friction 5.2;sv_full_alltalk 0;sv_gameinstructor_disable 1;sv_ignoregrenaderadio 0;sv_kick_players_with_cooldown 0;sv_kick_ban_duration 0;sv_lan 0;sv_log_onefile 0;sv_logbans 1;sv_logecho 0;sv_logfile 1;sv_logflush 0;sv_logsdir matches;sv_maxrate 0;sv_mincmdrate 30;sv_minrate 20000;sv_competitive_minspec 1;sv_competitive_official_5v5 1;sv_pausable 1;sv_pure 1;sv_pure_kick_clients 1;sv_pure_trace 0;sv_spawn_afk_bomb_drop_time 30;sv_steamgroup_exclusive 0;mp_respawn_on_death_t 0;mp_respawn_on_death_ct 0;mp_unpause_match;sv_vote_allow_in_warmup 1;sv_vote_allow_spectators 1;sv_vote_command_delay 2;sv_vote_count_spectator_votes 0;sv_vote_creation_timer 1;sv_vote_disallow_kick_on_match_point 1;sv_vote_failure_timer 1;sv_vote_issue_kick_allowed 0;sv_vote_issue_loadbackup_allowed 1;sv_vote_issue_restart_game_allowed 1;sv_vote_kick_ban_duration 0;sv_vote_quorum_ratio 0.7;sv_vote_timer_duration 30;sv_vote_to_changelevel_before_match_point 0;mp_warmuptime 15;mp_warmup_start;mp_warmup_pausetimer 1;mp_backup_round_file_pattern "%prefix%_round%round%.txt";mp_backup_round_file "backup";mp_endmatch_votenextmap 0;mp_endmatch_votenextleveltime 20;mp_endmatch_votenextmap_keepcurrent 0;mp_halftime_duration 20;say \x10Match will start when both teams are \x06!ready\x10',
  GOTV_OVERLAY: 'mp_teammatchstat_txt "Match {0} of {1}"; mp_teammatchstat_1 "{2}"; mp_teammatchstat_2 "{3}"',
  RESTORE_ROUND:
    'mp_backup_restore_load_file "{0}";say \x10Round \x06{1}\x10 has been restored, resuming match in:;say \x085...'
};
