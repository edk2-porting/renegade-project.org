<!DOCTYPE html>
<html lang="en-US">
	<head>
		<meta charset="UTF-8" />
		<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />
		<meta name="description" content="Windows Status Matrix" />
		<meta name="viewport" content="width=device-width,initial-scale=1.0,minimum-scale=1.0" />
		<link rel="stylesheet" href="/res/vue.css" />
		<link rel="stylesheet" href="/res/state.css" />
		<title>Windows Status Matrix</title>
		<script>
			const locale={
				loading:"Loading...",
				not_200:"status not ok: ",
				load_failed:"Load failed: ",
				lang:"en_us"
			}
		</script>
		<script src="/res/state.js"></script>
	</head>
	<body class="markdown-section">
		<h2>Windows Status Matrix</h2>
		<p>Sorted by support level</p>
		<table border="1" cellspacing="0">
			<thead>
				<tr>
					<th>Device</th>
					<th>Codename</th>
					<th>SoC</th>
					<th>USB</th>
					<th>UFS</th>
					<th>Display</th>
					<th>UEFI Buttons</th>
					<th>Touchscreen</th>
					<th>WiFi</th>
					<th>Bluetooth</th>
					<th>Battery</th>
					<th>Charge</th>
					<th>Virtualization</th>
					<th>GPU</th>
					<th>LTE</th>
					<th>Audio</th>
					<th>Location</th>
					<th>Sensors</th>
					<th>Camera</th>
				</tr>
			</thead>
			<tbody id="content">
			</tbody>
		</table>
		<br/>
		<table>
			<tbody>
				<tr>
					<td class="state-y">Y</td>
					<td>Already supported and available</td>
				</tr>
				<tr>
					<td class="state-n">N</td>
					<td>Currently impossible to be supported</td>
				</tr>
				<tr>
					<td class="state-p">P</td>
					<td>Problematic, might be supported but not necessarily available</td>
				</tr>
				<tr>
					<td class="state-w">W</td>
					<td>Tested on other devices, not ported to this device yet</td>
				</tr>
				<tr>
					<td class="state-t">T</td>
					<td>Will get supported hopefully, under testing or being ported</td>
				</tr>
				<tr>
					<td class="state-u">U</td>
					<td>Unknown status</td>
				</tr>
			</tbody>
		</table>
		<p>The status of some devices may be missing in this table, please add them to <a href="https://github.com/edk2-porting/renegade-project.org" target="_blank">GitHub</a>.</p>
		<div id="message" style="display:none">
			<p>Notes: </p>
			<ul id="messages"></ul>
		</div>
	</body>
	<script>initialize();</script>
</html>
