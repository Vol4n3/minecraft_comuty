class ioListener {
    /**
     * 
     * @param {socket.io} io 
     */
    static use(io) {
        io.on('connection', function (socket) {
            console.log(socket.id);
        })
    }
}
module.exports = ioListener;