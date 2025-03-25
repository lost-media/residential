--!strict

local RunService = game:GetService("RunService")
local UserInputService = game:GetService("UserInputService")
local Camera = workspace.Camera

type IMouse = {
	__index: IMouse,
	new: () -> Mouse,

	getViewSize: (self: Mouse) -> Vector2,
	getPosition: (self: Mouse) -> Vector2,
	getUnitRay: (self: Mouse) -> Ray,
	getOrigin: (self: Mouse) -> Vector3,
	getDelta: (self: Mouse) -> Vector2,
	screenPointToRay: (self: Mouse) -> RaycastParams,
	castRay: (self: Mouse) -> RaycastResult,
	getHit: (self: Mouse) -> Vector3?,
	getTarget: (self: Mouse) -> Instance?,
	getTargetFilter: (self: Mouse) -> { Instance },
	setTargetFilter: (self: Mouse, object: Instance | { Instance }) -> (),
	getRayLength: (self: Mouse) -> number,
	setRayLength: (self: Mouse, length: number) -> (),
	getFilterType: (self: Mouse) -> Enum.RaycastFilterType,
	setFilterType: (self: Mouse, filterType: Enum.RaycastFilterType) -> (),
	enableIcon: (self: Mouse) -> (),
	disableIcon: (self: Mouse) -> (),
	getModelOfTarget: (self: Mouse) -> Model?,
	getClosestInstanceToMouseFromParent: (self: Mouse, parent: Instance) -> Instance?,
}

export type Mouse = typeof(setmetatable(
	{} :: {
		currentPosition: Vector2,
		previousPosition: Vector2,
		filterDescendants: { Instance },
		filterType: Enum.RaycastFilterType,
		rayLength: number,
		ticks: number,
	},
	{} :: IMouse
))

---@class MouseModule
local Mouse: IMouse = {} :: IMouse
Mouse.__index = Mouse

local function onRenderStep(mouse: Mouse)
	if mouse.ticks % 2 == 0 then
		mouse.currentPosition = mouse:getPosition()
	else
		mouse.previousPosition = mouse:getPosition()
	end
	mouse.ticks = mouse.ticks % 10 + 1
end

function Mouse.new()
	local self = setmetatable({}, Mouse)
	self.filterDescendants = {}
	self.filterType = Enum.RaycastFilterType.Exclude
	self.rayLength = 500
	self.currentPosition = Vector2.new(0, 0)
	self.previousPosition = Vector2.new(0, 0)
	self.ticks = 1

	RunService:BindToRenderStep(
		"MeasureMouseMovement",
		Enum.RenderPriority.Input.Value,
		function(step)
			onRenderStep(self)
		end
	)

	return self
end

function Mouse:getViewSize()
	return Camera.ViewportSize
end

function Mouse:getPosition()
	return UserInputService:getMouseLocation()
end

function Mouse:getUnitRay()
	local position = self:getPosition()
	return Camera:ViewportPointToRay(position.X, position.Y)
end

function Mouse:getOrigin()
	return self:getUnitRay().Origin
end

function Mouse:getDelta()
	return (self.currentPosition - self.previousPosition)
end

function Mouse:screenPointToRay()
	local parameters = RaycastParams.new()
	parameters.FilterDescendantsInstances = self.filterDescendants
	parameters.FilterType = self.filterType
	return parameters
end

function Mouse:castRay()
	local parameters = self:screenPointToRay()
	return workspace:Raycast(
		self:getOrigin(),
		self:getUnitRay().Direction * self.rayLength,
		parameters
	)
end

function Mouse:getHit()
	local raycastResult = self:castRay()
	return raycastResult and raycastResult.Position or nil
end

function Mouse:getTarget()
	local raycastResult = self:castRay()
	return raycastResult and raycastResult.Instance or nil
end

function Mouse:getTargetFilter()
	return self.filterDescendants
end

function Mouse:setTargetFilter(object: Instance | { Instance })
	local dataType = typeof(object)
	if dataType == "Instance" then
		self.filterDescendants = { object :: Instance }
	elseif dataType == "table" then
		self.filterDescendants = object :: { Instance }
	else
		error("object expected an instance or a table of instances, received: " .. dataType)
	end
end

function Mouse:getRayLength()
	return self.rayLength
end

function Mouse:setRayLength(length)
	local dataType = typeof(length)
	assert(dataType == "number" and length >= 0, "length expected a number, received: " .. dataType)
	self.rayLength = length
end

function Mouse:getFilterType()
	return self.filterType
end

function Mouse:setFilterType(filterType)
	local filterTypes = Enum.RaycastFilterType:GetEnumItems()
	if table.find(filterTypes, filterType) then
		self.filterType = filterType
	else
		error("Invalid raycast filter type provided")
	end
end

function Mouse:enableIcon()
	UserInputService.MouseIconEnabled = true
end

function Mouse:disableIcon()
	UserInputService.MouseIconEnabled = false
end

function Mouse:getModelOfTarget()
	local target = self:getTarget()
	if target then
		return target:IsA("BasePart") and target:FindFirstAncestorWhichIsA("Model") or nil
	end
	return nil
end

function Mouse:getClosestInstanceToMouseFromParent(parent: Instance)
	local hit = self:getHit()
	if hit then
		local closestInstance = nil
		local closestDistance = math.huge
		for _, descendant in ipairs(parent:GetDescendants()) do
			if descendant:IsA("BasePart") then
				local distance = (descendant.Position - hit).Magnitude
				if distance < closestDistance then
					closestDistance = distance
					closestInstance = descendant
				end
			end
		end
		return closestInstance
	end

	return nil
end

function Mouse:getClosestAttachmentToMouse(attachments: { Attachment })
	local hit = self:getHit()
	if hit then
		local closestAttachment = nil
		local closestDistance = math.huge
		for _, attachment in ipairs(attachments) do
			local distance = (attachment.WorldCFrame.Position - hit).Magnitude
			if distance < closestDistance then
				closestDistance = distance
				closestAttachment = attachment
			end
		end
		return closestAttachment
	end

	return nil
end

return Mouse