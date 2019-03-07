using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Web.WebRequests;

namespace SmartManagerApi.Logic
{
	public class SmartManagerLogic
	{
		private readonly WebRequestsTools _webRequestsTools;

		public SmartManagerLogic(WebRequestsTools webRequestsTools)
		{
			_webRequestsTools = webRequestsTools;
		}
		public async Task<object> GetControls()
		{
			var controls = new {
				name = "default-app",
				props = new {
					toolbarTitle = "@@Toolbar.Caption.Value"
				},
				content = new List<object>() {
					new {
						type = "component",
						slot = "toolbar",
						value = new {
							name = "v-btn",
							props = new {
								color = "blue",
								fab = true,
								dark = true
							},
							content = new List<object>() {
								new {
									type = "component",
									value = new {
										name = "v-icon",
										content = new List<object>() {
											new {
												type = "raw",
												value = "add",
												props = new {
													dark = true
												}
											}
										}
									}
								}
							}
						}
					},
					new {
						type = "component",
						value = new {
							name = "v-layout",
							props = new {
								column=true,
								//align-start=false,
							},
						content = new List<object>() {
							new {
								type = "component",
								value = new {
									name = "v-text-field",
									props = new {
										label = "Email"
									}
								}
							},
							new {
								type = "component",
								value = new {
									name = "v-text-field",
									props = new {
										label = "Name",
										color="red"
									}
								}
							},
							new {
								type = "component",
								value = new {
									name = "v-text-field",
									props = new {
										label = "Regular"
									}
								}
							},
							new {
								type = "component",
								value = new {
									name = "v-btn",
									proprs = new {
										color = "red",
										dark = true
									},
									content = new List<object>() {
										new {
											type = "raw",
											value = "Send111"
										}
									}
								}
							}
						}
						}
					}
			}
			};
			return controls;
		}
	}
}
