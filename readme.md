ASSIGNMENT 6
Added authorization to user and cat methods that add, modify, or delete data.
Only the user themselves can update or delete their own data.
Only the owner of a cat can edit or delete it.
Admins can do whatever they wish.

This is accomplished by checking the authenticated user token's ID and ROLE and comparing it before doing real SQL calls.
