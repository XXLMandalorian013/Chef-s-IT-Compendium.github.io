#!/bin/sh
# The following checks are handle by VRRP w/out scripting any checks like the ones below. ie, if the host(s) powered off/crashed, primary NIC or cable is bad, or the primary switch is dead.
# If you are forwarding and its down, the network is down anyway and KeepAliveD can't help with this, in a two Pi double forward setup.
# Health check for keepalived function: Pi-hole (port 53) and Unbound (port 5335) must both answer NOERROR.
DIG=/usr/bin/dig
check() {
    "$DIG" "$@" example.com A +time=1 +tries=1 +noall +comments 2>/dev/null \
        | grep -q 'status: NOERROR'
}
# Pi-hole container/Docker daemon/the Pi itself.
check @127.0.0.1 || exit 1
# Unbound.
check @127.0.0.1 -p 5335 || exit 1
# Exit 0 if the above is happy or did not exit 1.
exit 0

