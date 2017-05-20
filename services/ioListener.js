class ioListener {
    /**
     * 
     * @param {socket.io} io 
     */
    static use(io) {
        io.on('connection', function (socket) {
            
        });
    }
}
module.exports = ioListener;