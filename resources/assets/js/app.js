require('./bootstrap');

if (typeof CONVERSATION_ID !== "undefined" && CONVERSATION_ID !== "") {
    var replyInput = $("#reply");
    new ConversationClient({debug: false}).login(USER_JWT).then(app => {
        app.getConversation(CONVERSATION_ID).then((conversation) => {
        conversation.on('text', (sender, message) => {
            axios.post('/ticket-entry', {
                "nexmo_id": sender.user.id,
                "text": message.body.text,
                "ticket_id": TICKET_ID
            });
        $(".panel-body:first").append("<strong>" + sender.user.name + " / web / In-App Message</strong><p>"+message.body.text+"</p><hr />");
})

    let typingIndicator = $("<div>");
    conversation.on("text:typing:on", data => {
        typingIndicator.text(data.user.name + " is typing...");
    replyInput.after(typingIndicator);
});
    conversation.on("text:typing:off", data => {
        typingIndicator.remove();
    });


    replyInput.focus(() => conversation.startTyping())
    replyInput.blur(() => conversation.stopTyping())
    $("#reply-submit").show();
    $("#add-reply").submit(() => {
        conversation.sendText(replyInput.val()).then(console.log).catch(console.log)
    replyInput.val("");
    return false;
});
});
});
}